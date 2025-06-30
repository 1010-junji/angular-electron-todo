import { contextBridge, ipcRenderer } from 'electron';
// Angular側と型を共有するために、型定義をインポートします
// このパスはプロジェクトの構成に合わせて調整してください
import type { Todo } from '../../client/src/typings.d';

// レンダラープロセス（Angular）から呼び出せるAPIを定義
// contextBridgeを使うことで、安全に機能を公開できる
contextBridge.exposeInMainWorld('electronAPI', {
  // 非同期でメインプロセスからTODOを読み込む
  loadTodos: (): Promise<Todo[]> => ipcRenderer.invoke('load-todos'),
  // メインプロセスにTODOの保存を依頼する
  saveTodos: (todos: Todo[]) => ipcRenderer.send('save-todos', todos),
});