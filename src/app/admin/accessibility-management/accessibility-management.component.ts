import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {profile, ProfileChecker} from "../ProfileChecker";

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

    async ngOnInit() {
        this.isAllowed = await ProfileChecker.checkProfile(this.authService, profile.admin);
        console.log(this.isAllowed);
        if (this.isAllowed == false) {
            this.routerService.navigate(['/admin']);
        }
    }
}
