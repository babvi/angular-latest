import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationsListComponent } from './recommendations-list/recommendations-list.component';


const routes: Routes = [
  {
    path: 'list',
    component: RecommendationsListComponent,
    data: {
      title: 'Manage Recommendations',
      permission: 'USER_UPDATE',
    },
  } 
  ,{ path: '', redirectTo: 'list', pathMatch: 'full' },	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
