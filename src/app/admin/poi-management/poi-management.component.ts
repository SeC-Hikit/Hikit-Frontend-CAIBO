import { Component, OnInit } from "@angular/core";
import { Status } from "src/app/Status";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { components } from "src/binding/Binding";

@Component({
  selector: "app-poi-management",
  templateUrl: "./poi-management.component.html",
  styleUrls: ["./poi-management.component.scss"],
})
export class PoiManagementComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

}
