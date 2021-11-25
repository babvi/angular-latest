import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';
import { FaqAddEditComponent } from './faq-add-edit/faq-add-edit.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    data: {
      title: 'FAQ Management',
    },
    children: [
      {
        path: 'add',
        component: FaqAddEditComponent,
        data: {
          title: 'Add FAQ',
          permission: 'FAQ_CREATE',
        },
      },
      {
        path: 'edit/:id',
        component: FaqAddEditComponent,
        data: {
          title: 'Edit FAQ',
          permission: 'FAQ_UPDATE',
        },
      },
      {
        path: 'list',
        component: FaqListComponent,
        data: {
          title: 'FAQ List',
          permission: 'FAQ_LIST',
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
export class FaqRoutingModule { }
