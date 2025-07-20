import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // [(ngModel)]を使うために必要

// --- Angular Material Components ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
// ---

import { RegexBuilderRoutingModule } from './regex-builder-routing.module';
import { RegexBuilderComponent } from './regex-builder.component';


@NgModule({
  declarations: [
    RegexBuilderComponent
  ],
  imports: [
    CommonModule,
    RegexBuilderRoutingModule,
    FormsModule, // 追加
    // --- Materialモジュールをインポート ---
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule
  ]
})
export class RegexBuilderModule { }