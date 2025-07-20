import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-regex-builder',
  templateUrl: './regex-builder.component.html',
  styleUrls: ['./regex-builder.component.scss']
})
export class RegexBuilderComponent {
  // 正規表現の入力値
  regexString = '[a-zA-Z]+';
  // テスト対象の文字列
  testString = 'Hello World 123, this is a test string.';
  // マッチング結果の表示用HTML（サニタイズ済み）
  highlightedResult: SafeHtml = '';
  // マッチした部分文字列のリスト
  matches: string[] = [];
  // エラーメッセージ
  errorMessage: string | null = null;
  // 正規表現のオプション
  regexOptions = {
    global: true, // gフラグ（全体検索）
    ignoreCase: false // iフラグ（大文字・小文字を区別しない）
  };

  constructor(private sanitizer: DomSanitizer) {
    // コンポーネント初期化時に一度評価を実行
    this.evaluateRegex();
  }

  /**
   * 入力値が変更されるたびに呼び出されるメソッド
   */
  onInputChange(): void {
    this.evaluateRegex();
  }

  /**
   * 正規表現を評価し、結果を更新するメインのメソッド
   */
  private evaluateRegex(): void {
    if (!this.regexString) {
      this.resetState('正規表現を入力してください。');
      this.highlightedResult = this.sanitizer.bypassSecurityTrustHtml(this.testString);
      return;
    }

    try {
      // 1. フラグを組み立てる
      let flags = '';
      if (this.regexOptions.global) flags += 'g';
      if (this.regexOptions.ignoreCase) flags += 'i';
      
      // 2. 正規表現オブジェクトを作成
      const regex = new RegExp(this.regexString, flags);
      this.errorMessage = null;

      // 3. マッチング処理
      if (!this.testString) {
        this.resetState();
        return;
      }

      const foundMatches = this.testString.match(regex);
      this.matches = foundMatches || [];

      // 4. マッチした部分をハイライト
      if (foundMatches) {
        const highlighted = this.testString.replace(regex, match => `<mark>${this.escapeHtml(match)}</mark>`);
        this.highlightedResult = this.sanitizer.bypassSecurityTrustHtml(highlighted);
      } else {
        this.highlightedResult = this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(this.testString));
      }

    } catch (e) {
      // 正規表現が無効な場合のエラーハンドリング
      this.resetState(`無効な正規表現です: ${(e as Error).message}`);
    }
  }

  /**
   * 状態をリセットするヘルパーメソッド
   * @param errorMessage 表示するエラーメッセージ (任意)
   */
  private resetState(errorMessage: string | null = null): void {
    this.matches = [];
    this.errorMessage = errorMessage;
    this.highlightedResult = '';
  }

  /**
   * XSS攻撃を防ぐため、HTMLとして表示する前に文字列をエスケープする
   * @param str エスケープ対象の文字列
   * @returns エスケープ後の文字列
   */
  private escapeHtml(str: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, str) || '';
  }
}