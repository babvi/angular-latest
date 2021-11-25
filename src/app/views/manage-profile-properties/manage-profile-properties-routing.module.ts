import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageProfilePropertiesComponent } from './manage-profile-properties.component';
import { AuthGuard } from './../../_guards/auth.guard';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageProfilePropertiesComponent,
    data: {
      title: 'Skills Management'
    },
    children: [
      {
        path: 'add',
        component: ManageComponent,
        data: {
          title: 'Add New Skill',
          permission: 'SKILL_CREATE',
        },
      },
      {
        path: 'edit/:uuid',
        component: ManageComponent,
        data: {
          title: 'Edit Skill',
          permission: 'SKILL_UPDATE',
        },
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          title: 'Skill List'
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
export class ManageProfilePropertiesRoutingModule { }
