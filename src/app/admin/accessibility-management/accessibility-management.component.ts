import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Profile, ProfileChecker} from "../ProfileChecker";

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
        let allowedProfiles: Profile[] = [Profile.admin, Profile.maintainer];
        this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
        if (this.isAllowed == false) {
            this.routerService.navigate(['/admin']);
        }
    }
}
