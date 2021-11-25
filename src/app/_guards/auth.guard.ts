import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor( private permissionsService: NgxPermissionsService, private authenticationService: AuthenticationService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		//console.log('called');
		let currentUser = localStorage.getItem('currentUser');
		if (!currentUser) {
            // not logged in so redirect to login page with the return url
        	this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        	return false;
        }

        let currentUserJson = JSON.parse(currentUser);
        let currentUserRole = currentUserJson.data.user_detail.role || '';
        
        if(currentUserRole == 'SUPER_ADMIN'){
        	this.permissionsService.loadPermissions(['SUPER_ADMIN']);
        	return true;	
        }

        let currentUserPermissions = currentUserJson.data.user_detail.permission || [];
        let routePermission = next.data.permission || null;
        if(routePermission == null || currentUserPermissions.indexOf(routePermission) != -1){
        	this.permissionsService.loadPermissions(currentUserPermissions);
        	return true;	
        } else{
        	this.router.navigate(['/403']);
        	return false;
        }
        
	}

	/*
	* Authentication check for child routes, In case we want to protect only child route. 
	*/
	canActivateChild(route: ActivatedRouteSnapshot,
                   	state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    	return this.canActivate(route, state);
  	}
}
