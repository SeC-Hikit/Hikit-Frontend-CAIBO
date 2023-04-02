import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaintenanceDto, MaintenanceService} from '../service/maintenance.service';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from '../service/trail-preview-service.service';
import {TrailDto, TrailResponse, TrailService} from '../service/trail-service.service';
import {UserCoordinates} from '../UserCoordinates';
import {GraphicUtils} from '../utils/GraphicUtils';
import *  as FileSaver from 'file-saver';
import {Coordinates2D, GeoTrailService, RectangleDto} from "../service/geo-trail-service";
import {environment} from "../../environments/environment.prod";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Observable, ObservedValueOf, Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../modal/info-modal/info-modal.component";
import {DateUtils} from "../utils/DateUtils";
import {PoiDto, PoiService} from "../service/poi-service.service";

export enum ViewState {
    NONE = "NONE", TRAIL = "TRAIL", POI = "POI", TRAIL_LIST = "TRAIL_LIST"
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

    isCycloToggled = false;

    isPoiLoaded = false;

    // Bound elements
    searchTermString: string = "";
    trailPreviewList: TrailPreview[];
    trailPreviewCount: number = 0;
    trailPreviewPage: number = 0;

    selectedTrail: TrailDto;
    selectedTrailPois: PoiDto[] = [];
    trailList: TrailDto[];
    connectedTrails: TrailDto[] = [];
    selectedTileLayer: string;
    selectedTrailBinaryPath: string;
    selectedTrailNotifications: AccessibilityNotification[];
    selectedTrailMaintenances: MaintenanceDto[];

    userPosition: UserCoordinates;
    highlightedLocation: Coordinates2D;

    isTrailSelectedVisible: boolean = false;
    isTrailFullScreenVisible: boolean = false;
    isTrailListVisible: boolean = false;
    isNotificationModalVisible: boolean = false;
    isUserPositionToggled: boolean = false;
    isLoading: boolean = false;

    zoomLevel = 12;
    sideView = ViewState.NONE;
    selectedTrailIndex: number = 0;
    showTrailCodeMarkers: boolean;
    poiHovering: PoiDto;
    selectedPoi: PoiDto;
    private trailMap: Map<string, TrailDto> = new Map<string, TrailDto>()


    constructor(
        private trailService: TrailService,
        private geoTrailService: GeoTrailService,
        private poiService: PoiService,
        private trailPreviewService: TrailPreviewService,
        private accessibilityService: NotificationService,
        private maintenanceService: MaintenanceService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.sideView = ViewState.NONE;
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
        let limit = this.maxTrailEntriesPerPage * this.getNextPageNumber(page);

        if (!code) {
            return this.trailPreviewService.getPreviews(page, limit, environment.realm, areDraftVisible)
        }
        return this.trailPreviewService.findTrailByNameOrLocationsNames(code, environment.realm,
            areDraftVisible, page, limit);
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
        let electedTrail = this.trailList.filter(t => t.id == id);

        if (electedTrail.length > 0) {
            this.sideView = ViewState.TRAIL;
            this.selectedTrail = electedTrail[0];
            this.loadRelatedForTrailId(id);
        }

        if (refresh || electedTrail.length == 0) {
            this.trailService.getTrailById(id).subscribe((resp) => {
                this.sideView = ViewState.TRAIL;
                this.selectedTrail = resp.content[0];
                this.loadRelatedForTrailId(id);
            })
        }

        this.loadNotificationsForTrail(id);
        this.loadLastMaintenanceForTrail(id);
        setTimeout(() => this.loadPoiForTrail(id), 2000);
    }

    private loadRelatedForTrailId(id: string) {
        const relatedTrailIds = this.selectedTrail.locations
            .flatMap((it) => {
                return it.encounteredTrailIds
            }).filter(it => it != id);
        const relatedTrailsSet = new Set(relatedTrailIds);
        this.loadRelatedTrailsByIdForSelectedTrail(Array.from(relatedTrailsSet.values()));
    }

    loadNotificationsForTrail(id: string): void {
        if (!id) {
            return;
        }
        this.accessibilityService.getUnresolvedForTrailId(id)
            .subscribe(notificationResponse => {
                this.selectedTrailNotifications = notificationResponse.content
            });
    }

    loadRelatedTrailsByIdForSelectedTrail(trailIds: string[]) {
        const trailDtoFromCache: TrailDto[] = trailIds
            .filter((trailId) => this.trailMap.has(trailId))
            .map((it) => this.trailMap.get(it))
        const trailIdsNotInCache = trailIds.filter((trailId) => !this.trailMap.has(trailId))
        const map: Promise<TrailResponse>[] = trailIdsNotInCache.map(it => this.trailService.getTrailById(it).toPromise());
        Promise.all(map).then((resps) => {
            const loadedTrails: TrailDto[] = resps.flatMap(it => it.content);
            loadedTrails.forEach(it => this.trailMap.set(it.id, it));
            this.connectedTrails = Array.from(trailDtoFromCache.concat(loadedTrails));
        });
    }

    loadLastMaintenanceForTrail(trailId: string): void {
        this.maintenanceService.getPastForTrail(trailId).subscribe(maintenanceResponse => {
            this.selectedTrailMaintenances = maintenanceResponse.content
        });
    }

    onDownloadGpx(): void {
        this.trailService.downloadGpx(this.getFileNameGpx(this.selectedTrail)).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            FileSaver.saveAs(blob, this.selectedTrail.code + ".gpx");
        });
    }

    onDownloadKml(): void {
        this.trailService.downloadKml(this.getFileNameKml(this.selectedTrail)).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            FileSaver.saveAs(blob, this.selectedTrail.code + ".kml");
        });
    }

    onDownloadPdf(): void {
        this.trailService.downloadPdf(
            this.getFileNamePdf(this.selectedTrail)
        ).subscribe(response => {
            let blob: any = new Blob([response], {type: 'text/json; charset=utf-8'});
            FileSaver.saveAs(blob, this.selectedTrail.code + "_" + this.selectedTrail.id + ".pdf");
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

    navigateToLocation(location: Coordinates2D) {
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
                this.populateTrailMap(e.content);
                this.showTrailCodeMarkers = this.electShowTrailCodes(this.zoomLevel);
                this.onDoneLoading();
            });
    }

    private populateTrailMap(e: TrailDto[]) {
        e.forEach((it) => this.trailMap.set(it.id, it))
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

    getFileNameGpx(trailDto: TrailDto): string {
        return this.replaceSpecialCharFromFileName(trailDto.staticTrailDetails.pathGpx ? trailDto.staticTrailDetails.pathGpx : trailDto.code + "_" + trailDto.id)
    }

    getFileNameKml(trailDto: TrailDto): string {
        return this.replaceSpecialCharFromFileName(trailDto.staticTrailDetails.pathKml ? trailDto.staticTrailDetails.pathKml : trailDto.code + "_" + trailDto.id)
    }

    getFileNamePdf(trailDto: TrailDto): string {
        return this.replaceSpecialCharFromFileName(trailDto.staticTrailDetails.pathPdf ? trailDto.staticTrailDetails.pathPdf : trailDto.code + "_" + trailDto.id)
    }

    replaceSpecialCharFromFileName(code) {
        return code.replace("/", "_")
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
        scroll(0, 0);
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

    private openInfoModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    onFocusOnNotification(notificationId: string) {
        const accessibilityNotification = this.selectedTrailNotifications.filter(it => it.id == notificationId)[0];
        this.openInfoModal(`Problema di percorrenza su sentiero ${this.selectedTrail.code}`,
            `<div>Riportato il: <b>${DateUtils.formatDateToIta(accessibilityNotification.reportDate)}</b></div>` +
            `<div>Descrizione: <b>${accessibilityNotification.description}</b></div>`)
    }

    onMaintenanceClick($event: string) {
        const lastMaintenance = this.selectedTrailMaintenances[0];
        if (lastMaintenance.id != $event) return;
        this.openInfoModal(`Ultima manutenzione effettuata su sentiero ${this.selectedTrail.code}`,
            `<div>Effettuata il: <b>${DateUtils.formatDateToIta(lastMaintenance.date)}</b></div>` +
            `<div>Descrizione: <b>${lastMaintenance.description}</b></div>`)
    }

    onToggleMode() {
        this.isCycloToggled = !this.isCycloToggled;
    }

    private electShowTrailCodes(zoomLevel: number) {
        return zoomLevel > 12;
    }

    private loadPoiForTrail(id: string) {
        this.isPoiLoaded = false;
        this.poiService.getByTrailCode(id)
            .subscribe((resp) => {
                this.isPoiLoaded = true;
                this.selectedTrailPois = resp.content;
            })
    }

    onPoiClick($event: PoiDto) {
        this.navigateToLocation($event.coordinates)
        this.selectedPoi = $event;
        this.sideView = ViewState.POI;
    }

    onPoiHovering($event: PoiDto) {
        this.poiHovering = $event;
    }

    onBackToTrailPoiClick() {
        this.sideView = ViewState.TRAIL;
        this.selectedPoi = null;
        this.poiHovering = null;
    }
}
