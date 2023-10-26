import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {MapUtils, ViewState} from "../MapUtils";
import {TrailDto, TrailMappingDto, TrailResponse, TrailService} from "../../service/trail-service.service";
import {Subject} from "rxjs";
import {MunicipalityDetails} from "../../service/municipality.service";
import {TrailPreview} from "../../service/trail-preview-service.service";
import {PoiDto} from "../../service/poi-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {MaintenanceDto} from "../../service/maintenance.service";
import {UserCoordinates} from "../../UserCoordinates";
import {Coordinates2D} from "../../service/geo-trail-service";
import {PlaceDto} from "../../service/place.service";
import {LocalityDto} from "../../service/ert.service";

@Component({
    selector: 'app-map-full-detail-view',
    templateUrl: './map-full-detail-view.component.html',
    styleUrls: ['./map-full-detail-view.component.scss']
})
export class MapFullDetailViewComponent implements OnInit {

    @Input() selectedTrailData: TrailDto;
    @Input() isMapInitialized: boolean;
    @Input() trailPreviewList: TrailPreview[];

    @Output() onSelectedTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadLastMaintenanceForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadPoiForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onGetUnresolvedForTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onHighlightedLocation: EventEmitter<Coordinates2D> = new EventEmitter<Coordinates2D>();
    @Output() onBackToTrailPoiClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() onBackToTrailList: EventEmitter<void> = new EventEmitter<void>();
    @Output() onLoadTrailPreview: EventEmitter<number> = new EventEmitter<number>();

    private searchTerms = new Subject<string>();

    // municipalities
    selectedMunicipality: MunicipalityDetails;
    municipalityTrails: TrailPreview[] = [];
    municipalityTrailsMax: number = 0;

    selectedTrail: TrailDto;
    selectedNotification: AccessibilityNotification;

    viewType = ViewState.TRAIL;
    isPortraitMode: boolean = false;
    searchTermString: string = "";
    trailPreviewPage: number = 0;

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
    isMobileDetailMode: boolean = false;

    constructor(
        private trailService: TrailService,
    ) { }

    ngOnInit(): void {
        this.isPortraitMode = this.getIsPortraitMode();
    }

    showTrailList() {
        this.searchTermString = "";
        this.onLoadTrailPreview.emit(0);
        this.showList();
    }

    showList() {
        this.viewType = ViewState.TRAIL_LIST;
    }

    onSearchKeyPress($event: string) {
        this.searchTermString = $event;
        if($event == "") {
            this.trailPreviewPage = 1;
            this.searchTerms.next($event);
        }
    }

    onSelectTrail(id: string, zoomIn: boolean = false, switchView: boolean = false) {
        if (!id) {
            return;
        }

        MapUtils.changeUrlToState(ViewState.TRAIL, id);
        this.selectTrail(id, true, switchView, zoomIn);
    }

    onSearchClick() {
        this.searchTerms.next(this.searchTermString);
    }

    loadTrailPreviewForMunicipality(page: number) {}

    selectTrail(id: string, refresh?: boolean, switchView = true, zoomIn = false): void {
        this.isLoading = true;
        if (!id) {
            return;
        }
        let electedTrail = this.trailList.filter(t => t.id == id);

        if (switchView) {
            this.sideView = ViewState.TRAIL;
        }

        if (electedTrail.length > 0) {
            this.sideView = ViewState.TRAIL;
            this.selectedTrail = electedTrail[0];
            this.loadRelatedForTrailId(id);
        }

        if (refresh || electedTrail.length == 0) {
            this.trailService.getTrailById(id).subscribe((resp) => {
                this.selectedTrail = resp.content[0];
                this.loadRelatedForTrailId(id);
            }, () => {

            }, () => {
                if(zoomIn) {
                    this.zoomToTrail = !this.zoomToTrail;
                }
                this.isLoading = false;
            })
        }

        this.loadNotificationsForTrail(id);
        this.onLoadLastMaintenanceForTrail.emit(id);
        this.onLoadPoiForTrail.emit(id);
    }

    loadNotificationsForTrail(id: string): void {
        if (!id) {
            return;
        }
        this.onGetUnresolvedForTrailId.emit(id);
    }
    private loadRelatedForTrailId(id: string){
        const relatedTrailIds = this.selectedTrail.locations
            .flatMap((it) => {
                return it.encounteredTrailIds
            }).filter(it => it != id);
        const relatedTrailsSet = new Set(relatedTrailIds);
        this.loadRelatedTrailsByIdForSelectedTrail(Array.from(relatedTrailsSet.values()));
    }

    loadRelatedTrailsByIdForSelectedTrail(trailIds: string[]){
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

    navigateToLocation(location: Coordinates2D){
        this.highlightedLocation = location;
    }

    onHighlightTrail(trail_id: string){
        this.highlightedTrail = this.trailMappings.get(trail_id);
    }

    getIsPortraitMode(){
        return(window.innerWidth < window.innerHeight);
    }


    ngOnChanges(changes: SimpleChanges) {
        if (this.isMapInitialized) {
            for (const propName in changes) {
                if (propName == "selectedTrailNotifications") {
                }
            }
        }
    }
}
