import { contextBridge, ipcRenderer } from 'electron';
import type { Todo, Settings, DbResult } from '../../client/src/typings.d';

contextBridge.exposeInMainWorld('electronAPI', {
  // TODO
  loadTodos: (): Promise<Todo[]> => ipcRenderer.invoke('load-todos'),
  saveTodos: (todos: Todo[]) => ipcRenderer.send('save-todos', todos),
  // Settings
  loadSettings: (): Promise<Settings> => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings: Settings) => ipcRenderer.send('save-settings', settings),
  // Database
  getTables: (): Promise<DbResult<string[]>> => ipcRenderer.invoke('get-tables'),
  getTableData: (tableName: string): Promise<DbResult<any[]>> => ipcRenderer.invoke('get-table-data', tableName),
});