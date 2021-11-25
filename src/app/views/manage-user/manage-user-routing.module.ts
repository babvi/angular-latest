import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageUserComponent } from './manage-user.component';
import { ManageUserAddEditComponent } from './manage-user-add-edit/manage-user-add-edit.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManageUserComponent,
    data: {
      title: 'Manage Employers'
    },
    children: [
      // {
      //   path: 'add',
      //   component: ManageUserAddEditComponent,
      //   data: {
      //     title: 'Add User',
      //     permission: 'USER_CREATE',
      //   },
      // },
      {
        path: 'view/:id',
        component: ManageUserAddEditComponent,
        data: {
          title: 'View Employer',
          permission: 'USER_UPDATE',
        },
      },
      {
        path: 'edit/:id',
        component: ManageUserAddEditComponent,
        data: {
          title: 'Edit Employer',
          permission: 'USER_UPDATE',
        },
      },
      {
        path: 'list',
        component: ManageUserListComponent,
        data: {
          title: 'Manage Employers List',
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
export class ManageUserRoutingModule { }
