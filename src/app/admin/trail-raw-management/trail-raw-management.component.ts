import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-trail-raw-management",
    templateUrl: "./trail-raw-management.component.html",
    styleUrls: ["./trail-raw-management.component.scss"],
})
export class TrailRawManagementComponent implements OnInit {

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
