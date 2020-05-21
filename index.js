const { app, Menu, BrowserWindow } = require('electron')

const path = require("path")
//console.log(path.join(__dirname, '/static/logo.png'))
let loadingWin
let mainWin

//实现单例运行
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWin) {
            if (mainWin.isMinimized()) { mainWin.restore() }
            mainWin.focus()
        }
    })
}

// 隐藏菜单栏
Menu.setApplicationMenu(null)

function createWindow() {
    loadingWin = new BrowserWindow({
        icon: path.join(__dirname, '/static/logo.png'),
        width: 400,
        height: 269,
        frame: false,
        resizable: false,
        transparent: true,
        show: false,
        alwaysOnTop: true
    })
    mainWin = new BrowserWindow({
        icon: path.join(__dirname, 'logo.ico'),
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    loadingWin.loadFile('./static/loading.gif')
    mainWin.loadURL('http://ui.enterprise.sdcsoft.com.cn')

    loadingWin.once('ready-to-show', () => {
        loadingWin.show()
    })
    mainWin.once('ready-to-show', () => {
        //flag = 1
        loadingWin.close()
        mainWin.maximize()
        mainWin.show()
    })
    loadingWin.on('closed', function () {
        loadingWin = null
    })
    mainWin.on('closed', () => {
        mainWin = null
    })

}

app.whenReady().then(createWindow)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (loadingWin === null) {
        createWindow()
    }
})