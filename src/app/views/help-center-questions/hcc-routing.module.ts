import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HCCComponent } from './hcc.component';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HCCComponent,
    data: {
      title: 'Help Center'
    },
    children: [
      {
        path: 'add',
        component: ManageComponent,
        data: {
          title: 'Add Question',
          permission: 'HCC_CREATE',
        },
      },
      {
        path: 'edit/:uuid',
        component: ManageComponent,
        data: {
          title: 'Edit Question',
          permission: 'HCC_UPDATE',
        },
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          title: 'Help Center Questions',
          permission: 'HCC_LIST',
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
export class HCCRoutingModule { }
