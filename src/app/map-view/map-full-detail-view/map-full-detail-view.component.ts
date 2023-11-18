import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapUtils, ViewState} from "../MapUtils";
import {TrailDto, TrailMappingDto, TrailResponse, TrailService} from "../../service/trail-service.service";
import {Observable, ObservedValueOf, Subject} from "rxjs";
import {MunicipalityDto} from "../../service/municipality.service";
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from "../../service/trail-preview-service.service";
import {PoiDto} from "../../service/poi-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {MaintenanceDto} from "../../service/maintenance.service";
import {Coordinates2D} from "../../service/geo-trail-service";
import {PlaceDto, PlaceRefDto} from "../../service/place.service";
import {LocalityDto} from "../../service/ert.service";
import {environment} from "../../../environments/environment.prod";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {PaginationUtils} from "../../utils/PaginationUtils";
import {SelectTrailArgument} from "../map.component";

@Component({
    selector: 'app-map-mobile-full-detail-view',
    templateUrl: './map-full-detail-view.component.html',
    styleUrls: ['./map-full-detail-view.component.scss']
})
export class MapFullDetailViewComponent implements OnInit {

    @Input() viewState = ViewState.TRAIL;
    @Input() selectedTrailData: TrailDto;
    @Input() selectedPoi: PoiDto;
    @Input() selectedTrailPois: PoiDto[] = [];
    @Input() isMapInitialized: boolean;
    @Input() isCycloToggled: boolean;
    @Input() isPoiLoaded: boolean;
    @Input() trailPreviewList: TrailPreview[];
    @Input() selectedTrailNotifications: AccessibilityNotification[];
    @Input() selectedPlace: PlaceDto;
    @Input() selectedNotification: AccessibilityNotification;
    @Input() selectedMunicipality: MunicipalityDto;
    @Input() trailMappings: Map<string, TrailMappingDto> = new Map<string, TrailMappingDto>();
    @Input() selectedTrailMaintenances: MaintenanceDto[];
    @Input() municipalityTrails: TrailPreview[];
    @Input() municipalityTrailsMax: number;
    @Input() selectedLocationDetails: LocalityDto;
    @Input() paginationPageSize : number;
    @Input() paginationCollectionSize: number;
    @Input() paginationPage : number;
    @Input() paginationSize: 'sm' | 'lg';
    @Input() paginationEllipses: boolean;
    @Input() paginationMaxSize: number;

    @Output() onTrailListPageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onSelectedTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadLastMaintenanceForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadPoiForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onGetUnresolvedForTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onHighlightedLocation: EventEmitter<Coordinates2D> = new EventEmitter<Coordinates2D>();
    @Output() onBackToTrailPoiClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() onBackToTrailList: EventEmitter<void> = new EventEmitter<void>();
    @Output() onLoadTrailPreview: EventEmitter<number> = new EventEmitter<number>();
    @Output() onSelectMunicipality: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectPlaceByRef: EventEmitter<PlaceRefDto> = new EventEmitter<PlaceRefDto>();
    @Output() onNavigateToTrailReportIssue: EventEmitter<string> = new EventEmitter<string>();
    @Output() onMaintenanceClick: EventEmitter<string> = new EventEmitter<string>();
    @Output() onAccessibilityNotificationSelection: EventEmitter<string> = new EventEmitter<string>();
    @Output() onShowCyclingClassification: EventEmitter<void> = new EventEmitter<void>();
    @Output() onShowHikingClassification: EventEmitter<void> = new EventEmitter<void>();
    @Output() onToggleFullPageTrail: EventEmitter<void> = new EventEmitter<void>();
    @Output() onPoiClick: EventEmitter<PoiDto> = new EventEmitter<PoiDto>();
    @Output() onPoiHovering: EventEmitter<PoiDto> = new EventEmitter<PoiDto>();

    @Output() onDownloadGpx: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDownloadKml: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDownloadPdf: EventEmitter<void> = new EventEmitter<void>();

    private searchTerms = new Subject<string>();


    sectionName = environment.publicName;

    selectedTrail: TrailDto;


    isPortraitMode: boolean = false;
    searchTermString: string = "";


    trailList: TrailDto[] = [];
    connectedTrails: TrailDto[] = [];


    highlightedLocation: Coordinates2D;
    zoomToTrail: boolean = false;
    isNotificationModalVisible: boolean = false;
    isLoading: boolean = false;

    selectedTrailIndex: number = 0;
    poiHoveringDto: PoiDto;

    private trailMap: Map<string, TrailDto> = new Map<string, TrailDto>()
    highlightedTrail: TrailDto;

    isSearch: boolean = false;

    private trailPreviewCount: number = 0;
    private trailPreviewPage: number = 1;

    constructor(
        private trailService: TrailService,
        private trailPreviewService: TrailPreviewService,
    ) {
    }

    ngOnInit(): void {
        this.isPortraitMode = this.getIsPortraitMode();

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
            });
    }

    showTrailList() {
        this.searchTermString = "";
        this.onLoadTrailPreview.emit(0);
        this.showList();
    }

    showList() {
        console.log(this.trailPreviewList.length);
        this.viewState = ViewState.TRAIL_LIST;
    }

    onSearchKeyPress($event: string) {
        this.searchTermString = $event;
        if ($event == "") {
            this.trailPreviewPage = 1;
            this.searchTerms.next($event);
        }
    }

    onSelectTrail(id: string, zoomIn: boolean = false, switchView: boolean = false) {
        if (!id) {
            return;
        }

        MapUtils.changeUrlToState(ViewState.TRAIL, id);
        this.selectTrail({id, refresh: true, switchView, zoomIn});
    }

    onSearchClick() {
        this.searchTerms.next(this.searchTermString);
    }

    loadTrailPreviewForMunicipality() {
    }

    selectTrail(sat: SelectTrailArgument): void {
        this.isLoading = true;
        if (!sat) {
            return;
        }
        let electedTrail = this.trailList.filter(t => t.id == sat.id);

        if (sat.switchView) {
            this.viewState = ViewState.TRAIL;
        }

        if (electedTrail.length > 0) {
            this.viewState = ViewState.TRAIL;
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
        this.onLoadLastMaintenanceForTrail.emit(sat.id);
        this.onLoadPoiForTrail.emit(sat.id);
    }

    loadNotificationsForTrail(id: string): void {
        if (!id) {
            return;
        }
        this.onGetUnresolvedForTrailId.emit(id);
    }

    private loadRelatedForTrailId(id: string) {
        const relatedTrailIds = this.selectedTrail.locations
            .flatMap((it) => {
                return it.encounteredTrailIds
            }).filter(it => it != id);
        const relatedTrailsSet = new Set(relatedTrailIds);
        this.loadRelatedTrailsByIdForSelectedTrail(Array.from(relatedTrailsSet.values()));
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

    navigateToLocation(location: Coordinates2D) {
        this.highlightedLocation = location;
        this.onHighlightedLocation.emit(location);
    }

    onHighlightTrail(trail_id: string) {
        this.highlightedTrail = this.trailMappings.get(trail_id);
    }

    selectMunicipality(id: string) {
        this.viewState = ViewState.MUNICIPALITY;
        this.onSelectMunicipality.emit(id);
    }

    navigateToSelectedTrailIndex(index: number) {
        this.selectedTrailIndex = index;
    }

    onToggleMode() {
        this.isCycloToggled = !this.isCycloToggled;
    }

    getIsPortraitMode() {
        return (window.innerWidth < window.innerHeight);
    }

    accessibilityNotificationSelection(id: string) {
        this.onAccessibilityNotificationSelection.emit(id);
        this.viewState = ViewState.ACCESSIBILITY;
    }

    poiClick(poidto: PoiDto) {
        this.viewState = ViewState.POI;
        this.selectedPoi = poidto;
        this.onPoiClick.emit(poidto);
    }

    poiHovering(poidto: PoiDto) {
        this.poiHoveringDto = poidto;
        this.onPoiHovering.emit(poidto);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isMapInitialized) {
            for (const propName in changes) {
                if (propName == "viewState") {
                    console.log("[SIDEVIEW]: " + this.viewState);
                }
                if (propName == "selectedTrailNotifications") {
                }
                if (propName == "trailPreviewList")
                    console.log("preview list changed");
                if (propName == "selectedTrailData")
                    if (this.selectedTrailData != null) {
                        setTimeout(() =>
                                this.selectTrail({
                                    id: this.selectedTrailData.id,
                                    refresh: true,
                                    switchView: false,
                                    zoomIn: false
                                }),
                            600);
                    }

            }
        }
    }

    toggleNotificationsModal(): void {
        this.isNotificationModalVisible = !this.isNotificationModalVisible;
    }

    private getTrailPreviewResponseObservable(code: string, page: number,
                                              areDraftVisible: boolean,
                                              entriesPerPage: number = 10) {
        const skip = PaginationUtils.getLowerBound(page, entriesPerPage);
        const limit = PaginationUtils.getUpperBound(page, entriesPerPage);

        if (!code) {
            return this.trailPreviewService.getPreviews(
                skip, limit, environment.realm, areDraftVisible)
        }
        return this.trailPreviewService.findTrailByNameOrLocationsNames(code, environment.realm,
            areDraftVisible, skip, limit);
    }
}
