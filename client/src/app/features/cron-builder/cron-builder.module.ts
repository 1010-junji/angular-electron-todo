import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // [(ngModel)]を使うために必要

// --- Angular Material Components ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
// ---

import { CronBuilderRoutingModule } from './cron-builder-routing.module';
import { CronBuilderComponent } from './cron-builder.component';


@NgModule({
  declarations: [
    CronBuilderComponent
  ],
  imports: [
    CommonModule,
    CronBuilderRoutingModule,
    FormsModule, // 追加
    // --- Materialモジュールをインポート ---
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule
  ]
})
export class CronBuilderModule { }