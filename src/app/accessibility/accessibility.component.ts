import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {TrailDto, TrailMappingDto, TrailService} from "../service/trail-service.service";
import {TrailPreviewService} from "../service/trail-preview-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../service/auth.service";
import {Subject} from "rxjs";
import {Marker} from "../map-preview/map-preview.component";
import {AdminNotificationService} from "../service/admin-notification-service.service";
import {Coordinates2D} from "../service/geo-trail-service";
import {MapPinIconType} from "../../assets/icons/MapPinIconType";

@Component({
    selector: 'app-accessibility',
    templateUrl: './accessibility.component.html',
    styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent implements OnInit {
    entryPerPage = 10;
    unresolvedPage = 1;
    solvedPage = 1;
    isLoading = false;

    totalUnresolvedNotification: number;
    totalSolvedNotification: number;

    private destroy$ = new Subject();

    isPreviewVisible: boolean = false;
    hasLoaded = false;

    realm : string = "";
    trailMapping: TrailMappingDto[] = [];
    selectedTrail: TrailDto;
    unresolvedNotifications: AccessibilityNotification[];
    solvedNotifications: AccessibilityNotification[];
    notificationSaved: string;
    markers: Marker[] = [];

    constructor(
        private notificationService: NotificationService,
        private adminNotificationService: AdminNotificationService,
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private modalService: NgbModal,
        private authService: AuthService,
    ) {
        this.unresolvedNotifications = [];
        this.solvedNotifications = [];
    }

    ngOnInit(): void {

        this.realm = this.authService.getInstanceRealm();
        this.trailPreviewService.getMappings(this.realm)
            .subscribe((resp) => {
                this.trailMapping = resp.content;
                this.loadNotification(1);
                this.loadSolvedNotification(1);
            })
    }

    loadNotification(page: number) {
        this.unresolvedPage = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadUnresolved(lowerBound, this.entryPerPage * page, this.realm);
    }

    loadSolvedNotification(page: number) {
        this.unresolvedPage = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadResolved(lowerBound, this.entryPerPage * page, this.realm);
    }

    loadUnresolved(skip: number, limit: number, realm: string) {
        this.hasLoaded = false;
        this.notificationService.getUnresolved(skip, limit, realm).subscribe(
            (resp) => {
                this.unresolvedNotifications = resp.content;
                this.totalUnresolvedNotification = resp.totalPages;
                this.hasLoaded = true;
            });
    }

    private loadResolved(skip: number, limit: number, realm: string) {
        this.hasLoaded = false;
        this.notificationService.getResolved(skip, limit, realm).subscribe(
            (resp) => {
                this.solvedNotifications = resp.content;
                this.totalSolvedNotification = resp.totalPages;
                this.hasLoaded = true;
            });
    }


    formatDate(dateString: string): string {
        return moment(dateString).format("DD/MM/YYYY");
    }

    getTrailCode(trailId) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == trailId);
        if (filtered.length > 0) {
            return filtered[0].code;
        }
        console.warn(`Could not find trail mapping for id: ${trailId}`)
        return "";
    }

    showPreview(trailId : string, coordinates: Coordinates2D) {
        this.trailService.getTrailById(trailId).subscribe(
            trailResp => {
                this.selectedTrail = trailResp.content[0];
                this.markers = [{
                    coords: coordinates,
                    icon: MapPinIconType.ALERT_PIN,
                    color: "yellow"
                }]
                this.togglePreview();
            }
        );
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

}
