import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Maintenance, MaintenanceService} from '../service/maintenance.service';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from '../service/trail-preview-service.service';
import {TrailCoordinates, TrailDto, TrailService} from '../service/trail-service.service';
import {UserCoordinates} from '../UserCoordinates';
import {GraphicUtils} from '../utils/GraphicUtils';
import *  as FileSaver from 'file-saver';
import {GeoTrailService, RectangleDto} from "../service/geo-trail-service";
import {environment} from "../../environments/environment.prod";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Observable, ObservedValueOf, Subject} from "rxjs";

export enum ViewState {
    NONE = "NONE", TRAIL = "TRAIL", PLACE_IN_TRAIL = "PLACE_IN_TRAIL", TRAIL_LIST = "TRAIL_LIST"
}

export enum TrailSimplifierLevel {
    NONE = "none",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    FULL = "full"
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    static TRAIL_DETAILS_ID = "trail-detail-column";

    static MAX_TRAIL_ENTRIES_PER_PAGE = 25;

    sectionName = environment.publicName;

    private searchTerms = new Subject<string>();

    isCycloToggled = true;
    // Bound elements
    trailPreviewList: TrailPreview[];
    selectedTrail: TrailDto;
    trailList: TrailDto[];

    selectedTileLayer: string;
    selectedTrailBinaryPath: string;
    trailNotifications: AccessibilityNotification[];
    lastMaintenance: Maintenance;
    userPosition: UserCoordinates;
    highlightedLocation: TrailCoordinates;

    isTrailSelectedVisible: boolean = false;
    isTrailFullScreenVisible: boolean = false;
    isTrailListVisible: boolean = false;
    isAllTrailVisible: boolean = true;
    isNotificationModalVisible: boolean = false;
    isUserPositionToggled: boolean = false;
    isLoading: boolean = false;

    zoomLevel = 12;
    sideView = ViewState.NONE;

    constructor(
        private trailService: TrailService,
        private geoTrailService: GeoTrailService,
        private trailPreviewService: TrailPreviewService,
        private accessibilityService: NotificationService,
        private maintenanceService: MaintenanceService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit(): void {
        this.changeTileLayer("topo");
        this.trailPreviewList = [];
        this.trailList = [];
        this.handleQueryParam();


        let observable: Observable<ObservedValueOf<Observable<TrailPreviewResponse>>> = this.searchTerms.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap((data: string,) => this.getTrailPreviewResponseObservable(data)));

        observable.subscribe(
            (resp) => {
                this.trailPreviewList = resp.content;
                this.showListOnSide();
            });
    }

    private getTrailPreviewResponseObservable(data: string): Observable<TrailPreviewResponse> {
        return this.trailPreviewService.findByCode(data, 0,
            MapComponent.MAX_TRAIL_ENTRIES_PER_PAGE, environment.realm);
    }

    private handleQueryParam() {
        const idFromPath: string = this.activatedRoute.snapshot.queryParamMap.get("id");
        this.selectTrail(idFromPath);
    }

    ngAfterViewInit(): void {
        let fullSize = GraphicUtils.getFullHeightSizeWOMenuImage();
        console.log(fullSize);
        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.minHeight = fullSize.toString() + "px";
        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.height = fullSize.toString() + "px";
    }

    onSelectTrail(id: string) {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {trail: id},
            queryParamsHandling: 'merge'
        });
        this.selectTrail(id);
    }

    selectTrail(_id: string): void {
        let singletonTrail = this.trailList.filter(t => t.id == _id);

        if (singletonTrail.length > 0) {
            this.sideView = ViewState.TRAIL;
            this.selectedTrail = singletonTrail[0];
        }
    }

    loadNotificationsForTrail(code: string): void {
        this.accessibilityService.getUnresolvedByTrailByCode(code).subscribe(notificationResponse => {
            this.trailNotifications = notificationResponse.content
        });
    }

    loadLastMaintenaceForTrail(code: string): void {
        this.maintenanceService.getPastForTrail(code).subscribe(maintenanceResponse => {
            this.lastMaintenance = maintenanceResponse.content[0]
        });
    }

    onDownloadGpx(): void {
        this.trailService.downloadGpx(this.getFileName(this.selectedTrail)).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            const url = window.URL.createObjectURL(blob);
            FileSaver.saveAs(blob, this.selectedTrail.code + ".gpx");
        });
    }

    onDownloadKml(): void {
        this.trailService.downloadKml(this.getFileName(this.selectedTrail)).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            const url = window.URL.createObjectURL(blob);
            FileSaver.saveAs(blob, this.selectedTrail.code + ".kml");
        });
    }

    onDownloadPdf(): void {
        this.trailService.downloadPdf(this.getFileName(this.selectedTrail)).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            const url = window.URL.createObjectURL(blob);
            FileSaver.saveAs(blob, this.selectedTrail.code + ".pdf");
        });
    }

    changeTileLayer(type: string): void {
        this.selectedTileLayer = type;
    }

    toggleNotificationsModal(): void {
        this.isNotificationModalVisible = !this.isNotificationModalVisible;
    }

    toggleFullPageTrail(): void {
        this.isTrailFullScreenVisible = !this.isTrailFullScreenVisible;
    }

    toggleUserPosition(): void {
        this.isUserPositionToggled = !this.isTrailFullScreenVisible;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.userPosition = new UserCoordinates(
                    position.coords.latitude,
                    position.coords.longitude)
            }, (error) => alert(error))
        }
    }

    navigateToLocation(location: TrailCoordinates) {
        this.highlightedLocation = location;
    }

    toggleAllTrails(): void {
        this.isAllTrailVisible = !this.isAllTrailVisible;
        if (this.trailList.length == 0 && this.isAllTrailVisible) {
            // this.loadAllTrails();
        }
    }

    geoLocateTrails($event: RectangleDto) {
        if (!$event) {
            return;
        }
        this.onLoading();
        let level = this.electTrailSimplifierLevel(this.zoomLevel);
        if (level == TrailSimplifierLevel.NONE) return;
        this.geoTrailService
            .locate($event, level.toUpperCase())
            .subscribe((e) => {
                this.trailList = e.content;
                this.onDoneLoading();
            });
    }

    onLoading() {
        this.isLoading = true;
    }

    onDoneLoading() {
        this.isLoading = false;
    }

    onZoomChange(zoomLevel: number) {
        this.zoomLevel = zoomLevel;
    }

    getFileName(fileName: TrailDto): string {
        return fileName.code + "_" + fileName.id;
    }

    loadFullList() {
        this.trailPreviewService.getPreviews(0, 10).subscribe(previewResponse => {
            this.trailPreviewList = previewResponse.content;
            this.showListOnSide();
        });
    }

    private showListOnSide() {
        this.sideView = ViewState.TRAIL_LIST;
    }

    electTrailSimplifierLevel(zoom: number): TrailSimplifierLevel {
        if (zoom <= 10) return TrailSimplifierLevel.NONE;
        if (zoom < 12) return TrailSimplifierLevel.LOW;
        if (zoom <= 15) return TrailSimplifierLevel.MEDIUM;
        if (zoom >= 16) return TrailSimplifierLevel.HIGH;
    }

    toggleCycloOption() {
        this.isCycloToggled = !this.isCycloToggled;
    }

    onSearchKeyPress($event) {
        this.searchTerms.next($event.target.value);
    }
}
