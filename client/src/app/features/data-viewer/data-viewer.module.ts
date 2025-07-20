import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Angular Material Components ---
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// ---

import { DataViewerRoutingModule } from './data-viewer-routing.module';
import { DataViewerComponent } from './data-viewer.component';


@NgModule({
  declarations: [
    DataViewerComponent
  ],
  imports: [
    CommonModule,
    DataViewerRoutingModule,
    // --- Materialモジュールをインポート ---
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class DataViewerModule { }