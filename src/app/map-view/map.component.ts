import {Component, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaintenanceDto, MaintenanceService} from '../service/maintenance.service';
import {AccessibilityNotification, NotificationService} from '../service/notification-service.service';
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from '../service/trail-preview-service.service';
import {TrailDto, TrailMappingDto, TrailResponse, TrailService} from '../service/trail-service.service';
import {UserCoordinates} from '../UserCoordinates';
import {GraphicUtils} from '../utils/GraphicUtils';
import * as FileSaver from 'file-saver';
import {Coordinates2D, GeoTrailService, LocateDto, RectangleDto} from "../service/geo-trail-service";
import {environment} from "../../environments/environment.prod";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Observable, ObservedValueOf, Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../modal/info-modal/info-modal.component";
import {DateUtils} from "../utils/DateUtils";
import {PoiDto, PoiService} from "../service/poi-service.service";
import {AuthService} from "../service/auth.service";
import {PaginationUtils} from "../utils/PaginationUtils";
import {PlaceDto, PlaceRefDto, PlaceService} from "../service/place.service";
import {ReadingUtils} from '../utils/ReadingUtils';
import {Location} from "@angular/common";
import {MapUtils, ViewState} from "./MapUtils";
import {MunicipalityDto, MunicipalityService} from "../service/municipality.service";
import {Choice, OptionModalComponent} from "../modal/option-modal/option-modal.component";
import {ErtService, LocalityDto} from "../service/ert.service";

//import {MapMobileViewComponent} from "./map-mobile-view/map-mobile-view.component";

export enum TrailSimplifierLevel {
    NONE = "none",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    FULL = "full"
}

export interface SelectTrailArgument {
    id: string,
    refresh?: boolean,
    switchView: boolean
    zoomIn: boolean
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    static MAP_ID = "map-full";


    maxTrailEntriesPerPage = 10;

    sectionName = environment.publicName;

    private searchTerms = new Subject<string>();

    isCycloToggled = false;

    isPoiLoaded = false;


    // Bound elements
    searchTermString: string = "";
    trailPreviewList: TrailPreview[] = [];
    trailPreviewCount: number = 0;
    trailPreviewPage: number = 0;

    municipalityList: MunicipalityDto[] = []

    selectedTrail: TrailDto;
    selectedNotification: AccessibilityNotification;

    // municipalities
    selectedMunicipality: MunicipalityDto;
    municipalityTrails: TrailPreview[] = [];
    municipalityTrailsMax: number = 0;

    selectedTrailPois: PoiDto[] = [];
    trailList: TrailDto[] = [];
    connectedTrails: TrailDto[] = [];
    selectedTileLayer: string;
    selectedTrailNotifications: AccessibilityNotification[];
    selectedTrailMaintenances: MaintenanceDto[];

    userPosition: UserCoordinates;
    highlightedLocation: Coordinates2D;
    zoomToTrail: boolean = false;
    isTrailFullScreenVisible: boolean = false;
    isNotificationModalVisible: boolean = false;
    isUserPositionToggled: boolean = false;
    isLoading: boolean = false;

    zoomLevel = 12;
    zoomChangingShallTriggerTrailsReload = false;
    sideView = ViewState.NONE;
    selectedTrailIndex: number = 0;
    showTrailCodeMarkers: boolean;
    poiHovering: PoiDto;
    selectedPoi: PoiDto;
    selectedPlace: PlaceDto;
    private trailMap: Map<string, TrailDto> = new Map<string, TrailDto>()
    trailMappings: Map<string, TrailMappingDto> = new Map<string, TrailMappingDto>();
    highlightedTrail: TrailDto;
    selectedLocationDetails: LocalityDto;
    isSearch: boolean = false;
    isPortraitMode: boolean = true;
    isMobileDetailMode: boolean = false;

    constructor(
        private trailService: TrailService,
        private geoTrailService: GeoTrailService,
        private poiService: PoiService,
        private trailPreviewService: TrailPreviewService,
        public accessibilityService: NotificationService,
        private maintenanceService: MaintenanceService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location,
        private modalService: NgbModal,
        private authService: AuthService,
        private placeService: PlaceService,
        private municipalityService: MunicipalityService,
        private ertService: ErtService,
    ) {
    }

    ngOnInit(): void {
        this.isPortraitMode = this.getIsPortraitMode();
        this.sideView = this.getViewFromLocation();
        this.loadMunicipalities();
        this.loadDataPassedByUrl();
        this.changeTileLayer("topo");
        this.ensureMapping();
        this.setupShortcuts();

        let observable: Observable<ObservedValueOf<Observable<TrailPreviewResponse>>> = this.searchTerms.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((data: string,) => {
                this.searchTermString = data;
                this.isSearch = this.searchTermString.trim() != "";
                this.isLoading = true;
                return this.getTrailPreviewResponseObservable(data, 1, false)
            }));

        observable.subscribe(
            (resp) => {
                this.trailPreviewList = resp.content;
                this.trailPreviewCount = resp.totalCount;
                this.isLoading = false;
                this.showListOnSide();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName == "sideView") {
                console.log("[SIDEVIEW]: " + this.sideView);
                document.getElementById("trail-detail-column")
                    .scrollTo(0, 0);
            }
        }
    }

    private getViewFromLocation(): ViewState {
        const path = this.location.path();
        return MapUtils.getViewFromPath(path);
    }

    private loadMunicipalities() {
        this.municipalityService.get().subscribe((it) => {
            this.municipalityList = it.content;
        }, () => {
        })
    }

    private getTrailPreviewResponseObservable(code: string, page: number,
                                              areDraftVisible: boolean,
                                              entriesPerPage: number = 10): Observable<TrailPreviewResponse> {
        const skip = PaginationUtils.getLowerBound(page, entriesPerPage);
        const limit = PaginationUtils.getUpperBound(page, entriesPerPage);

        if (!code) {
            return this.trailPreviewService.getPreviews(
                skip, limit, environment.realm, areDraftVisible)
        }
        return this.trailPreviewService.findTrailByNameOrLocationsNames(code, environment.realm,
            areDraftVisible, skip, limit);
    }

    ngAfterViewInit(): void {
        this.adaptSize();
    }

    adaptSize() {
        this.isPortraitMode = this.getIsPortraitMode();
        let fullSize = GraphicUtils.getFullHeightSizeWOMenuHeights();
//        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.minHeight = fullSize.toString() + "px";
//        document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.height = fullSize.toString() + "px";
        document.getElementById(MapComponent.MAP_ID).style.height = fullSize.toString() + "px";
    }

    onSelectTrail(id: string, zoomIn: boolean = false, switchView: boolean = false) {
        if (!id) {
            return;
        }
        MapUtils.changeUrlToState(ViewState.TRAIL, id);
        this.selectTrail({id: id, refresh: true, switchView: switchView, zoomIn: zoomIn});
    }

    selectTrail(sat: SelectTrailArgument): void {
        this.isLoading = true;
        if (!sat) {
            return;
        }
        let electedTrail = this.trailList.filter(t => t.id == sat.id);

        if (sat.switchView) {
            this.sideView = ViewState.TRAIL;
        }

        if (electedTrail.length > 0) {
            this.sideView = ViewState.TRAIL;
            this.selectedTrail = electedTrail[0];
            this.loadRelatedForTrailId(sat.id);
        }

        if (sat.refresh || electedTrail.length == 0) {
            this.trailService.getTrailById(sat.id).subscribe((resp) => {
                this.selectedTrail = resp.content[0];
                this.loadRelatedForTrailId(sat.id);
            }, () => {

            }, () => {
                if (sat.zoomIn) {
                    this.zoomToTrail = !this.zoomToTrail;
                }
                this.isLoading = false;
            })
        }

        this.loadNotificationsForTrail(sat.id);
        this.loadLastMaintenanceForTrail(sat.id);
        setTimeout(() => this.loadPoiForTrail(sat.id), 1200);
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
        this.isLoading = true;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.userPosition = new UserCoordinates(
                    position.coords.latitude,
                    position.coords.longitude)
                this.isLoading = false;
            }, (_) => {
                this.openInfoModal("Posizione non trovata o negata",
                    "Non è stato possibile usare il servizio di geolocalizzazione del dispositivo.")
                this.isLoading = false;
            });

        }
    }

    navigateToLocation(location: Coordinates2D) {
        this.highlightedLocation = location;
    }

    geoLocateTrails($event: RectangleDto) {
        if (!$event) {
            return;
        }

        const trailIdsNotForLoading = this.getTrailIdsNotForLoading();
        const locateDto: LocateDto = {rectangleDto: $event, trailIdsNotToLoad: trailIdsNotForLoading}
        const diff_with_already_loaded_trails: TrailDto[] = trailIdsNotForLoading.map(
            (it: string) => this.trailList.filter((tr) => tr.id == it)[0])

        this.zoomChangingShallTriggerTrailsReload = false;
        this.onLoading();
        const level = this.selectTrailSimplifierLevel(this.zoomLevel);
        if (level == TrailSimplifierLevel.NONE) return;
        this.geoTrailService
            .locate(locateDto, level.toUpperCase(), false)
            .subscribe((e) => {
                this.trailList = e.content.concat(diff_with_already_loaded_trails);
                this.populateTrailMap(e.content);
                this.showTrailCodeMarkers = this.electShowTrailCodes(this.zoomLevel);
                this.onDoneLoading();
            });
    }

    private getTrailIdsNotForLoading() {
        if (this.zoomChangingShallTriggerTrailsReload) return [];
        if (this.trailList.length > 0) {
            return this.trailList.map((it) => it.id)
        }
        return [];
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
        const previousZoomLevelSimplifier = this.selectTrailSimplifierLevel(this.zoomLevel);
        const newZoomLayerSimplifier = this.selectTrailSimplifierLevel(zoomLevel);
        if (previousZoomLevelSimplifier != newZoomLayerSimplifier)
            console.log("User zoomed in and trail simplified changed... reloading visible trail!")
        this.zoomChangingShallTriggerTrailsReload = true;
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
        this.searchTermString = "";
        this.loadTrailPreview(0);
        this.showListOnSide();
    }

    private showListOnSide() {
        this.sideView = ViewState.TRAIL_LIST;
    }

    selectTrailSimplifierLevel(zoom: number): TrailSimplifierLevel {
        if (zoom <= 10) return TrailSimplifierLevel.NONE;
        if (zoom < 15) return TrailSimplifierLevel.LOW;
        if (zoom <= 17) return TrailSimplifierLevel.MEDIUM;
        if (zoom >= 18) return TrailSimplifierLevel.HIGH;
    }

    toggleCycloOption() {
        this.isCycloToggled = !this.isCycloToggled;
    }

    navigateToSelectedTrailIndex(index: number) {
        this.selectedTrailIndex = index;
    }

    onSearchKeyPress($event: string) {
        this.searchTermString = $event;
        if ($event == "") {
            this.trailPreviewPage = 1;
            this.searchTerms.next($event);
        }
    }

    onSearchClick() {
        this.searchTerms.next(this.searchTermString);
    }

    navigateToTrailReportIssue(trailId: string) {
        scroll(0, 0);
        this.router.navigate(["accessibility", "reporting-form", trailId]);
    }

    loadTrailPreview(page: number) {
        let electedValue = page ? page : 1;
        this.trailPreviewPage = electedValue;
        this.getTrailPreviewResponseObservable(
            this.searchTermString, electedValue, false)
            .subscribe((resp) => {
                this.trailPreviewCount = resp.totalCount;
                this.trailPreviewList = resp.content;
            })
    }

    loadTrailPreviewForMunicipality(page: number) {
    }

    private openInfoModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    onAccessibilityNotificationSelection(id: string) {
        this.selectedNotification = this.selectedTrailNotifications.filter(it => it.id == id)[0];
        MapUtils.changeUrlToState(ViewState.ACCESSIBILITY, id);
        this.sideView = ViewState.ACCESSIBILITY;
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
        return zoomLevel > 14;
    }

    loadPoiForTrail(id: string) {
        this.isPoiLoaded = false;
        this.poiService.getByTrailCode(id)
            .subscribe((resp) => {
                this.isPoiLoaded = true;
                this.selectedTrailPois = resp.content;
            })
    }

    onPoiClick($event: PoiDto) {
        MapUtils.changeUrlToState(ViewState.POI, $event.id);
        this.navigateToLocation($event.coordinates);
        this.selectedPoi = $event;
        this.sideView = ViewState.POI;
    }

    onPoiHovering($event: PoiDto) {
        this.poiHovering = $event;
    }

    onBackToTrailPoiClick() {
        MapUtils.changeUrlToState(ViewState.TRAIL, this.selectedTrail.id);
        this.sideView = ViewState.TRAIL;
        this.selectedPoi = null;
        this.poiHovering = null;
    }

    onShowHikingClassification() {
        this.openInfoModal("Classificazioni escursionistiche",
            ReadingUtils.HIKING_CLASSIFICATION_DESCRIPTION_BODY
        );
    }

    onShowCyclingClassification() {
        this.openInfoModal("Classificazioni ciclo-escursionistiche", "");
    }

    private ensureMapping() {
        this.trailPreviewService.getMappings(this.authService.getInstanceRealm())
            .subscribe((resp) => {
                const mapping: TrailMappingDto[] = resp.content;
                mapping.forEach(it => this.trailMappings.set(it.id, it))
            });
    }

    onHighlightTrail(trail_id: string) {
        this.highlightedTrail = this.trailMappings.get(trail_id)
    }

    onSelectPlace(id: string) {
        MapUtils.changeUrlToState(ViewState.PLACE, id)
        this.placeService.getById(id).subscribe((it) => {
            if (it.content.length == 0) {
                this.openInfoModal("Errore", "La località selezionata non è stata trovata");
                return;
            }
            this.sideView = ViewState.PLACE;
            this.selectedPlace = it.content[0];
            this.isLoading = false;
        }, () => {
        }, () => {
            this.isLoading = false;
        })
    }

    onSelectPlaceByRef(place: PlaceRefDto) {
        this.isLoading = true;
        this.onSelectPlace(place.placeId);
    }

    onSelectPoi(id: string) {
        MapUtils.changeUrlToState(ViewState.POI, id)
        this.isLoading = true;
        this.poiService.getById(id).subscribe((it) => {
            if (it.content.length == 0) {
                this.openInfoModal("Errore", "Il punto d'interesse selezionato non è stato trovato");
                return;
            }
            this.selectedPoi = it.content[0]
            this.isLoading = false;
        }, () => {
        }, () => {
            this.isLoading = false;
        })
    }

    private loadDataPassedByUrl() {
        const id = this.activatedRoute.snapshot.paramMap.get("id");
        if (!id) return;
        switch (this.sideView) {
            case ViewState.TRAIL:
                this.onSelectTrail(id, true);
                break;
            case ViewState.PLACE:
                this.onSelectPlace(id);
                break;
            case ViewState.POI:
                this.onSelectPoi(id);
                break;
            case ViewState.ACCESSIBILITY:
                this.onSelectAccessibilityNotificationFromUrl(id);
        }
    }

    onBackToTrailList() {
        MapUtils.changeUrlToState(ViewState.TRAIL_LIST)
        this.showTrailList()
    }

    private onSelectAccessibilityNotificationFromUrl(id: string) {
        this.isLoading = true;

        this.accessibilityService.getById(id).subscribe((notificationResp) => {
            const target = notificationResp.content[0];
            Promise.all([
                this.accessibilityService.getUnresolvedForTrailId(target.trailId).toPromise(),
                this.trailService.getTrailById(target.trailId).toPromise()]).then(
                (responses) => {
                    this.selectTrail({id: target.trailId, refresh: false, switchView: false, zoomIn: true});
                    this.selectedTrailNotifications = responses[0].content;
                    this.onAccessibilityNotificationSelection(id);
                })
        })
    }

    onGeolocaliseUserClick() {
        this.toggleUserPosition()
    }

    onMunicipalitySelectionClick() {
        const modal = this.modalService.open(OptionModalComponent)
        modal.componentInstance.title = "Seleziona un comune per esplorarne la rete sentieristica";
        modal.componentInstance.body = "";

        const selectors = this.municipalityList.map(it => {
            return {
                name: it.city,
                value: it.code,
                imageUrl: ""
            }
        })
        modal.componentInstance.selected = "";
        modal.componentInstance.selectors = selectors;
        modal.componentInstance.onPromptOk.subscribe((valueResolution: Choice) => {
            this.selectMunicipality(valueResolution.value)
        });
    }

    selectMunicipality(code: string) {
        this.selectedMunicipality = this.municipalityList.filter(it => it.code == code)[0]
        this.ertService.getLocalityDetailsByIstat(code).subscribe(resp => {
            this.selectedLocationDetails = resp.content[0];
        });
        this.trailPreviewService.findByMunicipality(this.selectedMunicipality.city, environment.realm,
            false, 0, 1000).subscribe((resp) => {
            this.municipalityTrails = resp.content
            this.municipalityTrailsMax = resp.totalCount
            this.sideView = ViewState.MUNICIPALITY;
            MapUtils.changeUrlToState(ViewState.MUNICIPALITY, code);
        })
    }

    onTerrainChangeSelectionClick() {
        const modal = this.modalService.open(OptionModalComponent)
        modal.componentInstance.title = "Seleziona una base cartografica";
        modal.componentInstance.body = "";
        const path = "/assets/cai/terrains/"
        const selectors = [
            {name: "Topografica", value: "topo", imageUrl: path + "topo.webp"},
            {name: "Geopolitica", value: "geopolitic", imageUrl: path + "geopolitic1.webp"},
            {name: "Geopolitica 2", value: "geopolitic2", imageUrl: path + "geopolitic2.webp"}
        ];
        modal.componentInstance.selected = selectors.filter(it => it.value == this.selectedTileLayer)[0];
        modal.componentInstance.selectors = selectors;
        modal.componentInstance.onPromptOk.subscribe((valueResolution: Choice) => {
            this.changeTileLayer(valueResolution.value)
        });
    }

    onSelectMunicipality($event: string) {
        this.selectMunicipality($event);
    }

    getIsPortraitMode() {
        return (document.documentElement.clientWidth < document.documentElement.clientHeight);
    }

    onDetailMode() {
        this.isMobileDetailMode = !this.isMobileDetailMode;
    }

    onSearchClickShowListOfTrails() {
        this.sideView = ViewState.NONE;

        setTimeout(() => {
            this.onBackToTrailList();
            setTimeout(() => {
                let element = document.getElementById("search-box");
                if (element) {
                    element.focus();
                }
            }, 300);
        }, 100);
    }


    private setupShortcuts() {
        const context = this;
        window.addEventListener('keydown', function (event) {
            // SHIFT+F
            if (event.shiftKey && event.code === 'KeyF') {
                context.onSearchClickShowListOfTrails();
            }
        })
    }

    onForceMapRefresh() {
        // TODO
    }
}
