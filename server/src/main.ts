import { app, BrowserWindow } from 'electron';
import * as path from 'path';
// IPCハンドラ登録用の関数を各モジュールからインポート
import { registerTodoHandlers } from './ipc/todo';
import { registerSettingsHandlers } from './ipc/settings';
import { registerDatabaseHandlers } from './ipc/database';

const isDev = !app.isPackaged;

let loadURL: (win: BrowserWindow) => void;
if (!isDev) {
  const serve = require('electron-serve');
  loadURL = serve({
    directory: path.join(app.getAppPath(), '../app'),
  });
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  
  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    loadURL(mainWindow);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  registerTodoHandlers(userDataPath);
  registerSettingsHandlers(userDataPath);
  registerDatabaseHandlers(userDataPath);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});