import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CronBuilderComponent } from './cron-builder.component';

const routes: Routes = [{ path: '', component: CronBuilderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CronBuilderRoutingModule { }
