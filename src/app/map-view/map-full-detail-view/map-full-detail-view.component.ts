import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapUtils, ViewState} from "../MapUtils";
import {TrailDto, TrailMappingDto, TrailService} from "../../service/trail-service.service";
import {Observable, ObservedValueOf, Subject} from "rxjs";
import {MunicipalityDto} from "../../service/municipality.service";
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from "../../service/trail-preview-service.service";
import {PoiDto} from "../../service/poi-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {MaintenanceDto} from "../../service/maintenance.service";
import {Coordinates2D} from "../../service/geo-trail-service";
import {PlaceDto, PlaceRefDto} from "../../service/place.service";
import {EventDto, LocalityDto} from "../../service/ert.service";
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
    @Input() connectedTrails : TrailDto[] = [];
    @Input() selectedTrailData: TrailDto;
    @Input() selectedPoi: PoiDto;
    @Input() selectedTrailPois: PoiDto[] = [];
    @Input() isMapInitialized: boolean;
    @Input() isCycloToggled: boolean;
    @Input() isPoiLoaded: boolean;
    @Input() trailPreviewList: TrailPreview[];
    @Input() selectedTrailNotifications: AccessibilityNotification[];
    @Input() selectedPlace: PlaceDto;
    @Input() selectMunicipalityEvents: EventDto[];
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
    @Output() onSelectedTrail: EventEmitter<SelectTrailArgument> = new EventEmitter<SelectTrailArgument>();
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
    @Output() onShowMapTemporarilyPress: EventEmitter<void> = new EventEmitter<void>();

    private searchTerms = new Subject<string>();

    isPortraitMode: boolean = false;
    searchTermString: string = "";


    highlightedLocation: Coordinates2D;
    zoomToTrail: boolean = false;
    isNotificationModalVisible: boolean = false;
    isLoading: boolean = false;

    selectedTrailIndex: number = 0;
    poiHoveringDto: PoiDto;

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
        this.onSelectedTrail.emit({id, refresh: true, switchView, zoomIn});
    }

    onSearchClick() {
        this.searchTerms.next(this.searchTermString);
    }

    loadTrailPreviewForMunicipality() {
    }

    loadNotificationsForTrail(id: string): void {
        if (!id) {
            return;
        }
        this.onGetUnresolvedForTrailId.emit(id);
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

    toggleTransparency() {
        this.onShowMapTemporarilyPress.emit();
    }
}
