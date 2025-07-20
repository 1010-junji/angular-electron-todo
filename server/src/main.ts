import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import mysql from 'mysql2/promise';

import type { Todo, Settings, DbResult } from '../../client/src/typings.d';

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

// --- IPC通信 (レンダラープロセスとの連携) ---

const userDataPath = app.getPath('userData');
const todosFilePath = path.join(userDataPath, 'todos.json');
const settingsFilePath = path.join(userDataPath, 'settings.json');


// --- TODO機能のハンドラ ---
ipcMain.on('save-todos', (event, todos: Todo[]) => {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Failed to save todos:', err instanceof Error ? err.message : err);
  }
});

ipcMain.handle('load-todos', async (): Promise<Todo[]> => {
  try {
    if (fs.existsSync(todosFilePath)) {
      const data = fs.readFileSync(todosFilePath, 'utf8');
      return JSON.parse(data) as Todo[];
    }
    return [];
  } catch (err) {
    console.error('Failed to load todos:', err);
    return [];
  }
});

// --- 設定機能のハンドラ ---
ipcMain.on('save-settings', (event, settings: Settings) => {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error('Failed to save settings:', err instanceof Error ? err.message : err);
  }
});

ipcMain.handle('load-settings', async (): Promise<Settings> => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data) as Settings;
    }
    return {} as Settings;
  } catch (err) {
    console.error('Failed to load settings:', err);
    return {} as Settings;
  }
});


// --- DB操作機能のハンドラ ---

/**
 * 設定ファイルを読み込むヘルパー関数
 */
function readSettings(): Settings | null {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data) as Settings;
    }
    return null;
  } catch (error) {
    console.error('Failed to read settings file:', error);
    return null;
  }
}

// テーブル一覧を取得するハンドラ
ipcMain.handle('get-tables', async (): Promise<DbResult<string[]>> => {
  const settings = readSettings();
  if (!settings || !settings.mysql || !settings.mysql.database) {
    return { success: false, error: 'データベース名が設定されていません。' };
  }

  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(settings.mysql);
    const [rows] = await connection.query<mysql.RowDataPacket[]>('SHOW TABLES');
    const tables = rows.map(row => Object.values(row)[0] as string);
    return { success: true, data: tables };
  } catch (err: any) {
    console.error('Failed to get tables:', err);
    return { success: false, error: `DBエラー: ${err.message}` };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// 指定されたテーブルのデータを取得するハンドラ
ipcMain.handle('get-table-data', async (event, tableName: string): Promise<DbResult<any[]>> => {
  if (!tableName) {
    return { success: false, error: 'テーブル名が指定されていません。' };
  }

  const settings = readSettings();
  if (!settings || !settings.mysql) {
    return { success: false, error: 'DB接続設定が不十分です。' };
  }
  
  let connection: mysql.Connection | null = null;
  try {
    connection = await mysql.createConnection(settings.mysql);
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      'SELECT * FROM ?? LIMIT 100',
      [tableName]
    );
    return { success: true, data: rows };
  } catch (err: any) {
    console.error(`Failed to get data from table ${tableName}:`, err);
    return { success: false, error: `DBエラー: ${err.message}` };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});