import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // アプリケーションのルートパスにアクセスした場合、'/todo'にリダイレクトする
  { path: '', pathMatch: 'full', redirectTo: 'todo' },
  // 'todo'パスにアクセスされたら、TodoModuleを遅延読み込みする
  { path: 'todo', loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule) },
  // 'cron-builder'パスにアクセスされたら、CronBuilderModuleを遅延読み込みする
  { path: 'cron-builder', loadChildren: () => import('./features/cron-builder/cron-builder.module').then(m => m.CronBuilderModule) },
  // 'regex-builder'パスにアクセスされたら、RegexBuilderModuleを遅延読み込みする
  { path: 'regex-builder', loadChildren: () => import('./features/regex-builder/regex-builder.module').then(m => m.RegexBuilderModule) },
  // 'settings'パスにアクセスされたら、SettingsModuleを遅延読み込みする
  { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  // 'data-viewer'パスにアクセスされたら、DataViewerModuleを遅延読み込みする
  { path: 'data-viewer', loadChildren: () => import('./features/data-viewer/data-viewer.module').then(m => m.DataViewerModule) },
  { path: 'todo', loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule) },
  { path: 'cron-builder', loadChildren: () => import('./features/cron-builder/cron-builder.module').then(m => m.CronBuilderModule) },
  { path: 'regex-builder', loadChildren: () => import('./features/regex-builder/regex-builder.module').then(m => m.RegexBuilderModule) },
  { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'data-viewer', loadChildren: () => import('./features/data-viewer/data-viewer.module').then(m => m.DataViewerModule) },
  // 上記のいずれにもマッチしないパスは、'/todo'にリダイレクトする
  { path: '**', redirectTo: 'todo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }