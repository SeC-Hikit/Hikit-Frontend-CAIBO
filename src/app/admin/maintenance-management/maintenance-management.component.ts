import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Profile, ProfileChecker} from "../ProfileChecker";

@Component({
    selector: "app-maintenance-management",
    templateUrl: "./maintenance-management.component.html",
    styleUrls: ["./maintenance-management.component.scss"],
})
export class MaintenanceManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService,
                private routerService: Router) {
    }

    async ngOnInit() {
        let allowedProfiles: Profile[] = [Profile.admin, Profile.maintainer, Profile.casualVolunteer];
        this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
        if (this.isAllowed == false) {
            this.routerService.navigate(['/admin']);
        }
    }
}
