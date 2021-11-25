import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
      path: '',
      component: SettingsComponent,
      data: {
        title: 'Settings',
        permission: 'CONFIG_LIST',
      },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
