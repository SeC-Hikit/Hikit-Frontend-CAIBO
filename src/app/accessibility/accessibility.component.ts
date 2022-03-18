import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {DateUtils} from "../utils/DateUtils";
import {TrailDto, TrailMappingDto, TrailService} from "../service/trail-service.service";
import {MaintenanceDto, MaintenanceService} from "../service/maintenance.service";
import {AdminMaintenanceService} from "../service/admin-maintenance.service";
import {TrailPreviewService} from "../service/trail-preview-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../service/auth.service";
import {InfoModalComponent} from "../modal/info-modal/info-modal.component";

@Component({
    selector: 'app-accessibility',
    templateUrl: './accessibility.component.html',
    styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent implements OnInit {

    unresolvedNotifications: AccessibilityNotification[] = [];
    solvedNotifications: AccessibilityNotification[] = [];

    constructor(private modalService: NgbModal,
                private maintenanceService: MaintenanceService,
                private trailPreviewService: TrailPreviewService,
                private trailService: TrailService,
                private authService: AuthService
    ) {}

    ngOnInit() {
    }

}
