import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CmsComponent } from './cms.component';
import { CmsAddEditComponent } from './cms-add-edit/cms-add-edit.component';
import { CmsListComponent } from './cms-list/cms-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CmsComponent,
    data: {
      title: 'CMS Management'
    },
    children: [
      {
        path: 'add',
        component: CmsAddEditComponent,
        data: {
          title: 'Add CMS',
          permission: 'CMS_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: CmsAddEditComponent,
        data: {
          title: 'Edit CMS',
          permission: 'CMS_UPDATE',
        },
      },
      {
        path: 'list',
        component: CmsListComponent,
        data: {
          title: 'CMS List',
          permission: 'CMS_LIST',
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
export class CmsRoutingModule { }
