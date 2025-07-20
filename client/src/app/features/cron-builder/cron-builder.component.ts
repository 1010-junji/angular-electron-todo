import { Component } from '@angular/core';
import * as cronParser from 'cron-parser';

@Component({
  selector: 'app-cron-builder',
  templateUrl: './cron-builder.component.html',
  styleUrls: ['./cron-builder.component.scss']
})
export class CronBuilderComponent {
  cronExpression = '* * * * *';
  schedules: Date[] = [];
  errorMessage: string | null = null;

  constructor() {
    this.parseCron();
  }

  onCronExpressionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.cronExpression = inputElement.value;
    this.parseCron();
  }

  /**
   * ★★★ 抜本的な修正 ★★★
   * イテレータを使わない、よりシンプルで堅牢な実装に変更します。
   */
  private parseCron(): void {
    if (!this.cronExpression || !this.cronExpression.trim()) {
      this.schedules = [];
      this.errorMessage = null;
      return;
    }

    try {
      // 1. iteratorオプションを削除。これにより、戻り値は常に`CronExpression`オブジェクトに確定する。
      const expression = cronParser.parseExpression(this.cronExpression.trim());

      const nextSchedules: Date[] = [];
      
      // 2. シンプルなforループで10回next()を呼び出す。
      for (let i = 0; i < 10; i++) {
        // 3. expression.next()は、常に`CronDate`オブジェクトを直接返す。
        const nextCronDate = expression.next();
        // 4. `CronDate`オブジェクトのtoDate()メソッドを呼び出す。
        nextSchedules.push(nextCronDate.toDate());
      }
      
      this.schedules = nextSchedules;
      this.errorMessage = null; // 成功したのでエラーをクリア
    } catch (err) {
      this.schedules = [];
      if (err instanceof Error) {
        this.errorMessage = `無効なCron式です: ${err.message}`;
      } else {
        this.errorMessage = '無効なCron式です。';
      }
    }
  }
}