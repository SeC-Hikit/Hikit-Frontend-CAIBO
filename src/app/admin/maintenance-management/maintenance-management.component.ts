import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../service/auth.service";

@Component({
    selector: "app-maintenance-management",
    templateUrl: "./maintenance-management.component.html",
    styleUrls: ["./maintenance-management.component.scss"],
})
export class MaintenanceManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.getUserProfile().then((resp) => {
            if (resp == 'admin' || resp == 'maintainer' || resp == 'casual_volunteer') {
                this.isAllowed = true;
            }
        });
    }
}
