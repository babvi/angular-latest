import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationsListComponent } from './recommendations-list/recommendations-list.component';
import { ManageRecommendationsComponent } from './manage-recommendations.component';

const routes: Routes = [
  {
    path: '',
    component: ManageRecommendationsComponent,
    data: {
      title: 'Recommendations'
    },
    children: [
       {
        path: 'list',
        component: RecommendationsListComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
  	]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRecommendationsRoutingModule { }
