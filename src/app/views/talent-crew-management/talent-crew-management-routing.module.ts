import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TalentCrewManagementComponent } from './talent-crew-management.component';
import { TalentCrewListComponent } from './talent-crew-list/talent-crew-list.component';
import { AddEditTalentCrewComponent } from './add-edit-talent-crew/add-edit-talent-crew.component';

const routes: Routes = [ {
  path: '',
  data: {
    title: 'Manage T&C'
  },
  children: [
    // {
    //   path: 'add',
    //   component: ManageUserAddEditComponent,
    //   data: {
    //     title: 'Add User',
    //     permission: 'USER_CREATE',
    //   },
    // // },
    // {
    //   path: 'view/:id',
    //   component: ManageUserAddEditComponent,
    //   data: {
    //     title: 'View Employer',
    //     permission: 'USER_UPDATE',
    //   },
    // },
    {
      path: 'edit/:id',
      component: AddEditTalentCrewComponent,
      data: {
        title: 'Edit Talent & Crew',
        permission: 'USER_UPDATE',
      },
    },
    {
      path: 'list',
      component: TalentCrewListComponent,
      data: {
        title: 'Talent & Crew List',
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
export class TalentCrewManagementRoutingModule { }
