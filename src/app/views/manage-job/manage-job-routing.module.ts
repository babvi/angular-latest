import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageJobComponent } from './manage-job.component';
import { ManageJobListComponent } from './manage-job-list/manage-job-list.component';
import { ManageJobViewComponent } from './manage-job-view/manage-job-view.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManageJobComponent,
    data: {
      title: 'Manage Jobs'
    },
    children: [
      {
        path: 'list',
        component: ManageJobListComponent,
        data: {
          title: 'Manage Jobs List',
          permission: 'USER_LIST',
        },
      },
      {
        path: 'view/:id',
        component: ManageJobViewComponent,
        data: {
          title: 'Manage Job View',
          permission: 'USER_LIST',
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
export class ManageJobRoutingModule { }
