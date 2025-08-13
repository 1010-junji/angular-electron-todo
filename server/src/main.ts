import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import serve from 'electron-serve';

// レンダラープロセスと型を共有します
import type { Todo } from '../../client/src/typings.d';

// Electronが提供するisPackagedプロパティを使用する。
// アプリがパッケージ化されている場合(本番)はtrue、されていない場合(開発)はfalseを返す。
const isDev = !app.isPackaged;

// 本番モード用のハンドラを事前に準備する
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
    width: 800,
    height: 600,
    webPreferences: {
      // preloadスクリプトを指定。レンダラープロセス内で実行される前に読み込まれる
      preload: path.join(__dirname, 'preload.js'),
      // Context Isolationはセキュリティ上trueが推奨
      contextIsolation: true,
      // レンダラープロセスでNode.jsのAPIを使えなくする（セキュリティ上重要）
      nodeIntegration: false,
    },
  });

  mainWindow.setMenu(null);

  if (isDev) {
    // 開発モードの場合: Angularの開発サーバーに接続
    mainWindow.loadURL('http://localhost:4200');
    // 開発ツールを自動で開く
    mainWindow.webContents.openDevTools();
  } else {
    // 本番モード: 事前に準備しておいたハンドラを使ってロードする
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

// ユーザーデータを保存するファイルのパスを取得
// app.getPath('userData') はOSごとに適切なアプリケーションデータ保存場所を返す
// 例: Windows: C:\Users\<username>\AppData\Roaming\<YourAppName>
const todosFilePath = path.join(app.getPath('userData'), 'todos.json');

// レンダラーからの'save-todos'メッセージを受け取る
ipcMain.on('save-todos', (event, todos: Todo[]) => {
  try {
    // 受け取ったTODOデータをJSON形式でファイルに書き込む
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Failed to save todos:', err instanceof Error ? err.message : err);
  }
});

// レンダラーからの'load-todos'メッセージを処理する
ipcMain.handle('load-todos', async (): Promise<Todo[]> => {
  try {
    // ファイルが存在するか確認
    if (fs.existsSync(todosFilePath)) {
      // ファイルを読み込んで内容をパースして返す
      const data = fs.readFileSync(todosFilePath, 'utf8');
      // JSON.parseの結果はanyなので、型アサーションするか、バリデーションライブラリを使うのがより安全です
      return JSON.parse(data) as Todo[];
    }
    // ファイルがなければ空の配列を返す
    return [];
  } catch (err) {
    console.error('Failed to load todos:', err);
    return [];
  }
});