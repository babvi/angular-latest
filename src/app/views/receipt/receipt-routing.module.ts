import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptComponent } from './receipt.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReceiptComponent,
    data: {
      title: 'Manage Receipt'
    },
    children: [
      {
        path: 'list',
        component: ReceiptListComponent,
        data: {
          title: 'Receipt List',
          permission: 'USER_LIST',
        },
      },
      {
        path: 'list/:id',
        component: ReceiptListComponent,
        data: {
          title: 'Receipt List',
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
export class ReceiptRoutingModule { }
