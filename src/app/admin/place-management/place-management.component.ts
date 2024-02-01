import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-place-management',
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.scss']
})
export class PlaceManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService,
                private routerService: Router) { }

    ngOnInit(): void {
        this.authService.getUserProfile().then((resp) => {
            if (resp == 'admin' || resp == 'maintainer' || resp == 'content_creator') {
                this.isAllowed = true;
            } else {
                this.routerService.navigate(["/admin"]);
            }
        });
    }
}
