import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: "app-menu-slim",
  templateUrl: "./menu-slim.component.html",
  styleUrls: ["./menu-slim.component.scss"],
})
export class MenuSlimComponent implements OnInit {
  usernameToShow: string;
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.usernameToShow = "Accesso";
    document.onload = () => {
      this.authService.onIsAuth(() => {
        this.isLoggedIn = true;
      });
    };

    this.router.events.subscribe((change) => {
      if (change instanceof NavigationEnd) {
        this.authService.onIsAuth(() => (this.isLoggedIn = true));
      }
    });
  }
}
