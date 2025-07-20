import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings } from '../../../typings.d';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;
  isElectron = !!window.electronAPI;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {
    // リアクティブフォームを初期化
    this.settingsForm = this.fb.group({
      mysql: this.fb.group({
        host: ['localhost'],
        port: [3306, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        user: ['root'],
        password: [''],
        database: ['']
      })
    });
  }

  ngOnInit(): void {
    if (this.isElectron) {
      this.loadSettings();
    }
  }

  /**
   * メインプロセスから設定を読み込み、フォームに反映させる
   */
  async loadSettings(): Promise<void> {
    try {
      const settings = await window.electronAPI.loadSettings();
      if (settings && settings.mysql) {
        // NgZone.runで囲むことで、非同期処理後のフォーム更新をAngularに正しく伝える
        this.zone.run(() => {
          this.settingsForm.patchValue(settings);
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.showNotification('設定の読み込みに失敗しました。', 'error');
    }
  }

  /**
   * 現在のフォームの値をメインプロセスに保存する
   */
  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.showNotification('入力内容に誤りがあります。', 'error');
      return;
    }
    if (!this.isElectron) {
      this.showNotification('ブラウザモードでは設定を保存できません。', 'error');
      return;
    }

    try {
      const settings: Settings = this.settingsForm.value;
      window.electronAPI.saveSettings(settings);
      this.showNotification('設定を保存しました。', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showNotification('設定の保存に失敗しました。', 'error');
    }
  }

  /**
   * 画面下部にスナックバーで通知を表示する
   * @param message 表示するメッセージ
   * @param panelClass 'success' または 'error'
   */
  private showNotification(message: string, panelClass: 'success' | 'error'): void {
    this.snackBar.open(message, '閉じる', {
      duration: 3000,
      panelClass: [panelClass === 'success' ? 'success-snackbar' : 'error-snackbar']
    });
  }
}