/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/**
 *  This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 *
 * @module JS API: UI Development
 */

const { app, session } = require('electron')
const { execSync, spawn } = require('child_process')
const net = require('net')
const path = require('path')
const env = require('../util/env')
const installer = require('electron-devtools-installer')
const installExtension = installer.default || installer
const VUEJS_DEVTOOLS = installer.VUEJS_DEVTOOLS
const VUEJS_DEVTOOLS_BETA = installer.VUEJS_DEVTOOLS_BETA
let devtoolsProcess = null
const devtoolsMode = (
  process.env.ZAP_DEVTOOLS_MODE || 'standalone'
).toLowerCase()

/**
 * Wait until Vue DevTools server accepts TCP connections.
 *
 * @returns {Promise<void>}
 */
function waitForDevtoolsServer() {
  return new Promise((resolve) => {
    const deadline = Date.now() + 10000
    const tryConnect = () => {
      const socket = net.createConnection({ host: 'localhost', port: 8098 })
      socket.once('connect', () => {
        socket.destroy()
        env.logInfo('Vue DevTools server is reachable; booting app')
        resolve()
      })
      socket.once('error', () => {
        socket.destroy()
        if (Date.now() >= deadline) {
          env.logInfo('Vue DevTools server wait timed out; booting app anyway')
          resolve()
          return
        }
        setTimeout(tryConnect, 200)
      })
    }
    tryConnect()
  })
}

/**
 * Starts standalone Vue DevTools server and bootstraps main UI when ready.
 */
function bootStandaloneDevtools() {
  process.env.ZAP_STANDALONE_DEVTOOLS = '1'
  try {
    execSync('pkill -f "vue-devtools"', { stdio: 'ignore' })
  } catch (_err) {
    // No previous devtools process found.
  }
  devtoolsProcess = spawn(
    'npx',
    ['vue-devtools', '--host', 'localhost', '--port', '8098'],
    {
      cwd: path.join(__dirname, '../../..'),
      stdio: 'inherit',
      shell: true
    }
  )
  env.logInfo(
    'Vue DevTools standalone server starting on http://localhost:8098'
  )
  waitForDevtoolsServer().then(() => {
    require('./main-ui.js')
  })
}

/**
 * Attempts same-window Vue DevTools extension, then falls back to standalone.
 */
function bootEmbeddedDevtools() {
  const defaultSession = session.defaultSession
  defaultSession
    .clearStorageData({ storages: ['serviceworkers'] })
    .catch(() => {
      // Ignore cleanup failures in dev mode.
    })
  ;[VUEJS_DEVTOOLS.id, VUEJS_DEVTOOLS_BETA.id].forEach((extensionId) => {
    try {
      defaultSession.removeExtension(extensionId)
    } catch (_err) {
      // Ignore unload failures for non-installed extensions.
    }
  })

  installExtension(VUEJS_DEVTOOLS_BETA, { forceDownload: true })
    .then((extension) => {
      const extensionName =
        extension && extension.name ? extension.name : 'Vue DevTools'
      env.logInfo(`Embedded Vue DevTools loaded: ${extensionName}`)
      require('./main-ui.js')
    })
    .catch((err) => {
      env.logWarn(
        `Embedded Vue DevTools failed (${err && err.message ? err.message : err}); falling back to standalone`
      )
      bootStandaloneDevtools()
    })
}

// Clean up: kill the standalone devtools server when the app exits
app.on('will-quit', () => {
  if (devtoolsProcess && !devtoolsProcess.killed) {
    devtoolsProcess.kill()
  }
})

app.whenReady().then(() => {
  if (devtoolsMode === 'embedded') {
    env.logInfo('Devtools mode: embedded')
    bootEmbeddedDevtools()
    return
  }
  if (devtoolsMode === 'auto') {
    env.logInfo('Devtools mode: auto (embedded with standalone fallback)')
    bootEmbeddedDevtools()
    return
  }
  env.logInfo('Devtools mode: standalone')
  bootStandaloneDevtools()
})
