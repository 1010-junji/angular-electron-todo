import { Component, OnInit, NgZone } from '@angular/core';

// TODOアイテムの型を定義
interface Todo {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public todos: Todo[] = [];
  public newTodoText = '';

  // NgZoneはAngular外部の非同期処理(Electron API)の結果を
  // Angularの変更検知に正しく伝えるために使用
  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    // コンポーネント初期化時にファイルからTODOを読み込む
    this.loadTodosFromFile();
  }

  // Electron APIを呼び出してTODOを読み込む
  async loadTodosFromFile(): Promise<void> {
    if (window.electronAPI) {
      const loadedTodos = await window.electronAPI.loadTodos();
      // NgZone.run()内でデータを更新することで、UIが正しく更新される
      this.zone.run(() => {
        this.todos = loadedTodos || [];
      });
    } else {
      console.warn('Electron API not found. Running in browser mode.');
      // ブラウザでのデバッグ用にダミーデータを用意
      this.todos = [
        { title: 'ブラウザモードのタスク1', completed: false },
        { title: 'ブラウザモードのタスク2', completed: true },
      ];
    }
  }

  // Electron APIを呼び出してTODOをファイルに保存
  saveTodosToFile(): void {
    if (window.electronAPI) {
      // JSONシリアライズの循環参照を避けるため、シンプルなオブジェクトに変換
      const plainTodos = JSON.parse(JSON.stringify(this.todos));
      window.electronAPI.saveTodos(plainTodos);
    }
  }

  addTodo(): void {
    const trimmedText = this.newTodoText.trim();
    if (trimmedText) {
      this.todos.push({ title: trimmedText, completed: false });
      this.newTodoText = '';
      this.saveTodosToFile(); // 変更を保存
    }
  }

  deleteTodo(index: number): void {
    this.todos.splice(index, 1);
    this.saveTodosToFile(); // 変更を保存
  }

  toggleCompleted(index: number): void {
    if (this.todos[index]) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodosToFile(); // 変更を保存
    }
  }
}