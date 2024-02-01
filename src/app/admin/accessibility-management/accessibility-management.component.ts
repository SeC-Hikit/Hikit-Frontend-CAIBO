import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.scss']
})
export class AccessibilityManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService,
                private routerService: Router) {
    }

    ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
        if (resp == 'admin' || resp == 'maintainer') {
            this.isAllowed = true;
        } else {
            this.routerService.navigate(["/admin"]);
        }
    });
    }
}
