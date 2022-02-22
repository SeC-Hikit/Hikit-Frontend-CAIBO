import {Component, OnDestroy, OnInit} from "@angular/core";
import {
    TrailPreview,
    TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import {DateUtils} from "src/app/utils/DateUtils";
import {
    ImportService,
    TrailRawResponse,
} from "src/app/service/import.service";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {AdminTrailRawService} from "src/app/service/admin-trail-raw.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";

@Component({
    selector: "app-trail-raw-management",
    templateUrl: "./trail-raw-management.component.html",
    styleUrls: ["./trail-raw-management.component.scss"],
})
export class TrailRawManagementComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {}

}
