import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../service/auth.service";

@Component({
    selector: "app-trail-raw-management",
    templateUrl: "./trail-raw-management.component.html",
    styleUrls: ["./trail-raw-management.component.scss"],
})
export class TrailRawManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.getUserProfile().then((resp) => {
            if (resp == 'admin' || resp == 'maintainer') {
                this.isAllowed = true;
            }
        });
    }

}
