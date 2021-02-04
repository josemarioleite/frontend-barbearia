import { app, BrowserWindow, nativeTheme, Menu } from 'electron'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }
if (process.env.PROD) {
  global.__statics = __dirname
}
let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    // width: 1366,
    // height: 768,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION
    }
  })
  mainWindow.maximize()
  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
Menu.setApplicationMenu(false)
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
