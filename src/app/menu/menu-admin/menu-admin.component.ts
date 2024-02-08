import {Component, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {profile} from "../../admin/ProfileChecker";

@Component({
  selector: "app-menu-admin",
  templateUrl: "./menu-admin.component.html",
  styleUrls: ["./menu-admin.component.scss"],
})


export class MenuAdminComponent implements OnInit {

  userProfile: profile = profile.noProfile;

  // ngif inside menu-admin.component.html cannot get profile.noProfile
  // inside ProfileChecker
  noProfile: profile = profile.noProfile;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((change) => {
      if (change instanceof NavigationEnd) {
        this.assignRolesToUser();
      }
    });
  }

  private assignRolesToUser() {
    this.authService.onIsAuth(
      () => {
        this.authService.getUserProfile().then((name: string): void => {
          if (name == "admin") {
            this.userProfile = profile.admin;
          } else if (name == "maintainer") {
            this.userProfile = profile.maintainer;
          } else if (name == "content_creator") {
            this.userProfile = profile.contentCreator;
          } else if (name == "casual_volunteer") {
            this.userProfile = profile.casualVolunteer;
          }
        });

        this.authService.getUsername().then((name) => {
          // this.usernameToShow = name;
        });
      },
      () => {
        this.userProfile = profile.noProfile;
      }
    );
  }

  onLogoutClick(): void {
    //this.keycloakService.logout();
  }

  protected readonly profile = profile;
}
