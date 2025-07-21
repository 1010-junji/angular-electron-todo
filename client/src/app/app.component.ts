import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // アプリケーションのタイトル
  title = 'BR Operational Toolkit';

  // 各機能へのナビゲーションメニューの定義
  features = [
    { name: 'TODOリスト', path: '/todo', icon: 'check_box' },
    { name: 'Cronビルダー', path: '/cron-builder', icon: 'schedule' },
    { name: '正規表現ビルダー', path: '/regex-builder', icon: 'code' },
    { name: 'データ表示', path: '/data-viewer', icon: 'table_chart' },
  ];

  // 設定画面はメニューの下部に配置
  settings = { name: '環境設定', path: '/settings', icon: 'settings' };

}