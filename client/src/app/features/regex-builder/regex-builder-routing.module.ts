import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegexBuilderComponent } from './regex-builder.component';

const routes: Routes = [{ path: '', component: RegexBuilderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegexBuilderRoutingModule { }
