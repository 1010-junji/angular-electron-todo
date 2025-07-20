import { Component, OnInit, NgZone } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent implements OnInit {

  tables: string[] = [];
  selectedTable: string | null = null;
  tableData: any[] = [];
  displayedColumns: string[] = [];
  
  isLoadingTables = false;
  isLoadingData = false;
  errorMessage: string | null = null;
  
  isElectron = !!window.electronAPI;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    if (this.isElectron) {
      this.fetchTables();
    }
  }

  /**
   * メインプロセスからテーブル一覧を取得する
   */
  async fetchTables(): Promise<void> {
    this.isLoadingTables = true;
    this.errorMessage = null;
    this.resetTable();
    
    const result = await window.electronAPI.getTables();
    this.zone.run(() => {
      if (result.success) {
        this.tables = result.data || [];
      } else {
        this.errorMessage = result.error || 'テーブル一覧の取得に失敗しました。';
      }
      this.isLoadingTables = false;
    });
  }

  /**
   * ユーザーがテーブルを選択したときに呼び出される
   * @param tableName 選択されたテーブル名
   */
  async onTableSelect(tableName: string): Promise<void> {
    if (!tableName) return;
    this.selectedTable = tableName;
    this.isLoadingData = true;
    this.errorMessage = null;
    this.resetTable();

    const result = await window.electronAPI.getTableData(tableName);
    this.zone.run(() => {
      if (result.success && result.data) {
        this.tableData = result.data;
        if (result.data.length > 0) {
          // 最初の行からカラム名を取得
          this.displayedColumns = Object.keys(result.data[0]);
        }
      } else {
        this.errorMessage = result.error || `テーブル[${tableName}]のデータ取得に失敗しました。`;
      }
      this.isLoadingData = false;
    });
  }

  /**
   * テーブル表示をリセットする
   */
  private resetTable(): void {
    this.tableData = [];
    this.displayedColumns = [];
  }
}