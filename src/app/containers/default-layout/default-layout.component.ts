import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import { AuthenticationService } from './../../_services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public currentUserFirstName: any = '';
  constructor(private authenticationService: AuthenticationService,
    public router:Router) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    let currentUser = localStorage.getItem('currentUser');
    let currentUserJson = JSON.parse(currentUser);
    this.currentUserFirstName = currentUserJson.data.user_detail.first_name || '';
  }

  onLogout(){
    this.authenticationService.logout();
  }
}
