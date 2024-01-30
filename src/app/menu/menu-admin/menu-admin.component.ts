import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import * as Keycloak from "keycloak-js";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-menu-admin",
  templateUrl: "./menu-admin.component.html",
  styleUrls: ["./menu-admin.component.scss"],
})
export class MenuAdminComponent implements OnInit {
  isMaintainer: boolean = true;
  isCasualVolunteer: boolean = false;
  isContentCreator: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((change) => {
      if (change instanceof NavigationEnd) {
        this.assignNewUsername();
      }
    });
  }

  private assignNewUsername() {
    this.authService.onIsAuth(
      () => {
        this.isAdmin = true;
        this.authService.getUsername().then((name) => {
          // this.usernameToShow = name;
        });
      },
      () => {
        this.isAdmin = false;
      }
    );
  }

  onLogoutClick(): void {
    //this.keycloakService.logout();
  }
}
