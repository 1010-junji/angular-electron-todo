// Todoアイテムの具体的な型を定義します
export interface Todo {
  title: string;
  completed: boolean;
}

// 環境設定の型定義
export interface Settings {
  mysql: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
  };
}

// DB操作APIの返り値の型
export interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Windowインターフェースを拡張して、electronAPIプロパティを追加
export interface IElectronAPI {
  // TODO
  loadTodos: () => Promise<Todo[]>;
  saveTodos: (todos: Todo[]) => void;
  // Settings
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => void;
  // Database
  getTables: () => Promise<DbResult<string[]>>;
  getTableData: (tableName: string) => Promise<DbResult<any[]>>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}