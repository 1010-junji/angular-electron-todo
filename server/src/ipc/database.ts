import { ipcMain } from 'electron';
import * as path from 'path';
import mysql from 'mysql2/promise';
import type { DbResult } from '../../../client/src/typings.d';
import { readSettings } from './settings'; // settingsモジュールからヘルパー関数をインポート

export function registerDatabaseHandlers(userDataPath: string): void {
  const settingsFilePath = path.join(userDataPath, 'settings.json');

  // テーブル一覧を取得するハンドラ
  ipcMain.handle('get-tables', async (): Promise<DbResult<string[]>> => {
    const settings = readSettings(settingsFilePath);
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
  
    const settings = readSettings(settingsFilePath);
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
}