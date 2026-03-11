/**
 *
 *    Copyright (c) 2023 Silicon Labs
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

const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

if (process.argv.includes('--zap-devtools')) {
  try {
    const userAppIifePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'node_modules',
      '@vue',
      'devtools-electron',
      'dist',
      'user-app.iife.js'
    )
    const userAppIifeCode = fs.readFileSync(userAppIifePath, 'utf-8')

    const injectIife = () => {
      window.__VUE_DEVTOOLS_HOST__ = 'http://localhost'
      window.__VUE_DEVTOOLS_PORT__ = 8098
      // eslint-disable-next-line no-eval
      window.eval(userAppIifeCode)
    }

    // Initial injection + retries to avoid startup race where
    // devtools server is not yet ready on the first attempt.
    injectIife()
    setTimeout(injectIife, 1500)
    setTimeout(injectIife, 4000)
  } catch (_err) {
    // Ignore: devtools init should not break app startup.
  }
}

const electronApi = {
  setTitleBarOverlay: (titleBarOverlay) =>
    ipcRenderer.send('set-title-bar-overlay', titleBarOverlay)
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electronAPI', electronApi)
} else {
  window.electronAPI = electronApi
}
