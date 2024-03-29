import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Profile, ProfileChecker} from "../ProfileChecker";

@Component({
  selector: 'app-place-management',
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.scss']
})
export class PlaceManagementComponent implements OnInit {

    isAllowed: boolean = false;

    constructor(private authService: AuthService,
                private routerService: Router) { }

    async ngOnInit() {
      let allowedProfiles: Profile[] = [Profile.admin, Profile.maintainer, Profile.contentCreator];
      this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
      console.log(this.isAllowed);
      if (this.isAllowed == false) {
        this.routerService.navigate(['/admin']);
      }
    }
}
