import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Maintenance, MaintenanceService} from '../service/maintenance.service';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from '../service/trail-preview-service.service';
import {TrailCoordinatesDto, TrailDto, TrailService} from '../service/trail-service.service';
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

    static TRAIL_DETAILS_ID = "side-column";
    static MAP_ID = "map-full";


    maxTrailEntriesPerPage = 10;

    sectionName = environment.publicName;

    private searchTerms = new Subject<string>();

    isCycloToggled = true;
    // Bound elements
    searchTermString: string = "";
    trailPreviewList: TrailPreview[];
    trailPreviewCount: number = 0;
    trailPreviewPage: number = 0;

    selectedTrail: TrailDto;
    trailList: TrailDto[];

    selectedTileLayer: string;
    selectedTrailBinaryPath: string;
    selectedTrailNotifications: AccessibilityNotification[];
    lastMaintenance: Maintenance;
    userPosition: UserCoordinates;
    highlightedLocation: TrailCoordinatesDto;

    isTrailSelectedVisible: boolean = false;
    isTrailFullScreenVisible: boolean = false;
    isTrailListVisible: boolean = false;
    isAllTrailVisible: boolean = true;
    isNotificationModalVisible: boolean = false;
    isUserPositionToggled: boolean = false;
    isLoading: boolean = false;

    zoomLevel = 12;
    sideView = ViewState.NONE;
    selectedTrailIndex: number = 0;
    showTrailCodeMarkers: boolean;

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
            switchMap((data: string,) => {
                this.searchTermString = data;
                return this.getTrailPreviewResponseObservable(data, 0, false)
            }));

        observable.subscribe(
            (resp) => {
                this.trailPreviewList = resp.content;
                this.trailPreviewCount = resp.totalCount;
                this.showListOnSide();
            });
    }

    private getTrailPreviewResponseObservable(code: string, page: number,
                                              areDraftVisible: boolean): Observable<TrailPreviewResponse> {
        return this.trailPreviewService.findByCode(code, page * this.maxTrailEntriesPerPage,
            this.maxTrailEntriesPerPage * this.getNextPageNumber(page),
            environment.realm, areDraftVisible);
    }

    private getNextPageNumber(page: number) {
        return page + 1;
    }

    private handleQueryParam() {
        const idFromPath: string = this.activatedRoute.snapshot.queryParamMap.get("id");
        this.selectTrail(idFromPath);
    }

    ngAfterViewInit(): void {
        let fullSize = GraphicUtils.getFullHeightSizeWOMenuHeights();
        console.log(fullSize);
        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.minHeight = fullSize.toString() + "px";
        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.height = fullSize.toString() + "px";
        document.getElementById(MapComponent.MAP_ID).style.height = fullSize.toString() + "px";
    }

    onSelectTrail(id: string) {
        if (!id) {
            return;
        }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {trail: id},
            queryParamsHandling: 'merge'
        });
        this.selectTrail(id, true);
    }

    selectTrail(id: string, refresh?: boolean): void {
        if (!id) {
            return;
        }
        let singletonTrail = this.trailList.filter(t => t.id == id);

        if (singletonTrail.length > 0) {
            this.sideView = ViewState.TRAIL;
            this.selectedTrail = singletonTrail[0];
        }

        if (refresh || singletonTrail.length == 0) {
            this.trailService.getTrailById(id).subscribe((resp) => {
                this.sideView = ViewState.TRAIL;
                this.selectedTrail = resp.content[0];

            })
        }

        this.loadNotificationsForTrail(id);
    }

    loadNotificationsForTrail(id: string): void {
        if (!id) {
            return;
        }
        this.accessibilityService.getUnresolvedById(id).subscribe(notificationResponse => {
            this.selectedTrailNotifications = notificationResponse.content
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

    navigateToLocation(location: TrailCoordinatesDto) {
        this.highlightedLocation = location;
    }

    geoLocateTrails($event: RectangleDto) {
        if (!$event) {
            return;
        }
        this.onLoading();
        let level = this.electTrailSimplifierLevel(this.zoomLevel);
        if (level == TrailSimplifierLevel.NONE) return;
        this.geoTrailService
            .locate($event, level.toUpperCase(), false)
            .subscribe((e) => {
                this.trailList = e.content;
                this.showTrailCodeMarkers = this.electShowTrailCodes(this.zoomLevel);
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

    showTrailList() {
        this.loadTrailPreview(0);
        this.showListOnSide();
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

    navigateToSelectedTrailIndex(index: number) {
        this.selectedTrailIndex = index;
    }

    onSearchKeyPress($event: string) {
        this.searchTerms.next($event);
    }

    navigateToTrailReportIssue(trailId: string) {
        this.router.navigate(["accessibility", "reporting-form"],
            {
                queryParams: {trail: trailId},
                queryParamsHandling: 'merge'
            });
    }

    loadTrailPreview(page: number) {
        let electedValue = page ? page : 1;
        this.trailPreviewPage = electedValue;
        this.getTrailPreviewResponseObservable(
            this.searchTermString, electedValue - 1, false)
            .subscribe((resp) => {
                this.trailPreviewCount = resp.totalCount;
                this.trailPreviewList = resp.content;
            })
    }

    private electShowTrailCodes(zoomLevel: number) {
        return zoomLevel > 12;
    }
}
