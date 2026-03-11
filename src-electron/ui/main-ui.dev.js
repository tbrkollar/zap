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

const { app } = require('electron')
const { execSync, spawn } = require('child_process')
const net = require('net')
const path = require('path')
const env = require('../util/env')
// 1. Kill stale Vue DevTools instances and spawn a fresh one.
try {
  execSync('pkill -f "vue-devtools"', { stdio: 'ignore' })
} catch (_err) {
  // No previous devtools process found.
}
const devtoolsProcess = spawn(
  'npx',
  ['vue-devtools', '--host', 'localhost', '--port', '8098'],
  {
    cwd: path.join(__dirname, '../../..'),
    stdio: 'inherit',
    shell: true
  }
)
env.logInfo('Vue DevTools server starting on http://localhost:8098')

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

// 2. Clean up: kill the devtools server when the app exits
app.on('will-quit', () => {
  if (devtoolsProcess && !devtoolsProcess.killed) {
    devtoolsProcess.kill()
  }
})
// Require `main` process to boot app after devtools is reachable.
waitForDevtoolsServer().then(() => {
  require('./main-ui.js')
})
