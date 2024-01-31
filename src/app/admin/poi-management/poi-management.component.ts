import { Component, OnInit } from "@angular/core";
import { Status } from "src/app/Status";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { components } from "src/binding/Binding";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: "app-poi-management",
  templateUrl: "./poi-management.component.html",
  styleUrls: ["./poi-management.component.scss"],
})
export class PoiManagementComponent implements OnInit {

  isAllowed: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().then((resp) => {
      if (resp == 'admin' || resp == 'maintainer' || resp == 'content_creator') {
        this.isAllowed = true;
      }
    });
  }
}
