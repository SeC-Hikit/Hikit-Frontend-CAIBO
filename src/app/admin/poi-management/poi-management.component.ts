import { Component, OnInit } from "@angular/core";
import { Status } from "src/app/Status";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { components } from "src/binding/Binding";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Profile, ProfileChecker} from "../ProfileChecker";

@Component({
  selector: "app-poi-management",
  templateUrl: "./poi-management.component.html",
  styleUrls: ["./poi-management.component.scss"],
})
export class PoiManagementComponent implements OnInit {

  isAllowed: boolean = false;

  constructor(private authService: AuthService,
                private routerService: Router) {}

  async ngOnInit() {
    let allowedProfiles: Profile[] = [Profile.admin, Profile.maintainer, Profile.contentCreator];
    this.isAllowed = await ProfileChecker.checkProfile(this.authService, allowedProfiles);
    console.log(this.isAllowed);
    if (this.isAllowed == false) {
      this.routerService.navigate(['/admin']);
    }
  }
}
