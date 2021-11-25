import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolePermissionComponent } from './role-permission.component';
import { AuthGuard } from './../../_guards/auth.guard';

const routes: Routes = [
	{
    	path: '',
    	component: RolePermissionComponent,
    	data: {
      	title: 'Access Management',
				permission: 'ROLE_PERMISSION_LIST',
    	},
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolePermissionRoutingModule { }
