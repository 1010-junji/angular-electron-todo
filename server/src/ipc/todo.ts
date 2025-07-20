import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import type { Todo } from '../../../client/src/typings.d';

export function registerTodoHandlers(userDataPath: string): void {
  const todosFilePath = path.join(userDataPath, 'todos.json');

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
}