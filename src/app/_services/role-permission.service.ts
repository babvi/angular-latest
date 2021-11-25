import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Role } from './../model/role';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  	constructor( private http: HttpClient ) { }

  	getAllRoleList() {
		return this.http.get<any>(CONFIG.getAllRoleListURL)
		.pipe(map(data => {
        	// login successful if there's a jwt token in the response
        	return data;
    	}));
	}

	changeRoleStatus(status: string, id: number){
	    return this.http.put<any>(CONFIG.changeRoleStatusURL, {id: id, status: status})
	    .pipe(map(response => {
	        return response;
	    }));
  	}

  	
  	createRole(roleData: Role){
  		return this.http.post<any>(CONFIG.createRoleURL, roleData)
	    	.pipe(map(response => {
	        return response;
	    }));

  	}

  	updateRole(roleData: Role, id: number){
  		return this.http.put<any>(CONFIG.updateRoleURL + id, roleData)
	    	.pipe(map(response => {
	        return response;
	    }));
  	}

    getRolePermissions(id: number) {
        return this.http.post<any>(CONFIG.getAllPermissionListURL, {'role_id': id})
		.pipe(map(data => {
        	// login successful if there's a jwt token in the response
        	return data;
    	}));
    }


    assignPermissions(ids: any[], roleId: number){
    	return this.http.post<any>(CONFIG.assignPermissionURL + roleId, {'permission_key': ids.toString()})
		.pipe(map(data => {
        	// login successful if there's a jwt token in the response
        	return data;
    	}));
    }
}
