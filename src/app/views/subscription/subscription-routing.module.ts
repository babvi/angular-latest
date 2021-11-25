import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    data: {
      title: 'Manage Subscription'
    },
    children: [
      {
        path: 'list',
        component: SubscriptionListComponent,
        data: {
          title: 'Subscription List',
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
export class SubscriptionRoutingModule { }
