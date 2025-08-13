// このファイルに以下のコードを追加します

// Todoアイテムの具体的な型を定義します
export interface Todo {
  id: number; // もしくは string
  title: string;
  completed: boolean;
}

// Windowインターフェースを拡張して、electronAPIプロパティを追加
export interface IElectronAPI {
    loadTodos: () => Promise<Todo[]>;
    saveTodos: (todos: Todo[]) => void;
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI;
    }
  }