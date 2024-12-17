const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,  // Временно отключаем безопасность для разработки
      allowRunningInsecureContent: true,  // Разрешаем небезопасный контент (не рекомендуется в продакшене)
      preload: path.join(__dirname, 'preload.js'), // Добавьте этот файл, если хотите передать данные в рендерер через preload
    }
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'pallete-calc-app', 'browser', 'index.html');
  mainWindow.loadURL('file://' + indexPath);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
