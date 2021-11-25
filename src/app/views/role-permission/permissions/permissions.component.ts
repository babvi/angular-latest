import { Component, OnInit } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { RolePermissionService } from './../../../_services/role-permission.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})

export class PermissionsComponent implements OnInit {
	dropdownEnabled = true;
    items: TreeviewItem[];
    values: number[];
    config = TreeviewConfig.create({
        hasAllCheckBox: true,
        hasFilter: false,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

  	constructor( private rolePermissionService: RolePermissionService ) { }

	ngOnInit() {
		
	}

	onFilterChange(value: string) {
        console.log('filter:', value);
    }

}
	