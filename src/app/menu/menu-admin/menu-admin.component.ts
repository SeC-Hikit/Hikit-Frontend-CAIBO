import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as Keycloak from 'keycloak-js';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss']
})
export class MenuAdminComponent implements OnInit {

  usernameToShow : string; 
  isVisible: boolean = false;

  constructor(
    private router: Router,
    private authService : AuthService) { }

  ngOnInit(): void {
    this.usernameToShow = "Accesso";
    this.router.events.subscribe((change) => {
      if(change instanceof NavigationEnd ){
        this.assignNewUsername();    
      }
    })
  }

  private assignNewUsername() {
    this.authService.onIsAuth().then(isAuth=> {
      this.isVisible = isAuth;
      this.usernameToShow = this.authService.getUsername();
    });   
  }

  onLogoutClick(): void {
    //this.keycloakService.logout();
  }

}
