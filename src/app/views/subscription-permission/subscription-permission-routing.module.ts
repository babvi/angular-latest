import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubPermissionComponent } from './subscription-permission.component';
import { SubPermissionListComponent } from './subscription-permission-list/subscription-permission-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SubPermissionComponent,
    data: {
      title: 'Subscription Permission'
    },
    children: [
      {
        path: 'list',
        component: SubPermissionListComponent,
        data: {
          title: 'Subscription Permission List',
        },
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
  	]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubPermissionRoutingModule { }
