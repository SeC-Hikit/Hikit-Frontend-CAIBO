import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {TrailDto, TrailMappingDto} from 'src/app/service/trail-service.service';
import {Coordinates2D} from "../../service/geo-trail-service";
import {TrailPreview} from "../../service/trail-preview-service.service";
import {GraphicUtils} from "../../utils/GraphicUtils";
import {PoiDto} from "../../service/poi-service.service";
import {ViewState} from "../MapUtils";
import {PlaceDto} from "../../service/place.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {MaintenanceDto} from "../../service/maintenance.service";
import {MunicipalityDto} from "../../service/municipality.service";
import {LocalityDto} from "../../service/ert.service";

export interface PositionChangeRequest {
    coordinates: Coordinates2D,
    isTogglePreview: boolean
}

@Component({
    selector: 'app-map-mobile-view',
    templateUrl: './map-mobile-view.component.html',
    styleUrls: ['./map-mobile-view.component.scss']
})
export class MapMobileViewComponent implements OnInit {

    isFullView: boolean = false;
    min_panel_height : number = 150;

    @Input() sideView: ViewState;
    @Input() selectedTrail: TrailDto;
    @Input() isCycloSwitchOn: boolean;
    @Input() isMobileDetailOn: boolean;
    @Input() isPoiLoaded: boolean;
    @Input() trailPreviewList: TrailPreview[];
    @Input() selectedPlace: PlaceDto;
    @Input() trailMappings: Map<string, TrailMappingDto> = new Map<string, TrailMappingDto>();
    @Input() selectedTrailNotifications: AccessibilityNotification[];
    @Input() selectedPoi: PoiDto;
    @Input() selectedTrailMaintenances: MaintenanceDto[];
    @Input() selectedNotification: AccessibilityNotification;
    @Input() selectedMunicipality: MunicipalityDto;
    @Input() municipalityTrails: TrailPreview[];
    @Input() municipalityTrailsMax: number;
    @Input() selectedLocationDetails: LocalityDto;

    @Output() onSelectedTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadLastMaintenanceForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onLoadPoiForTrail: EventEmitter<string> = new EventEmitter<string>();
    @Output() onGetUnresolvedForTrailId: EventEmitter<string> = new EventEmitter<string>();
    @Output() onToggleModeClick = new EventEmitter<void>();
    @Output() onHighlightedLocation = new EventEmitter<Coordinates2D>();
    @Output() onDetailModeClick = new EventEmitter<void>();
    @Output() onBackToTrailPoiClick: EventEmitter<void> = new EventEmitter<void>();
    @Output() onBackToTrailList: EventEmitter<void> = new EventEmitter<void>();
    @Output() onLoadTrailPreview: EventEmitter<number> = new EventEmitter<number>();
    @Output() onNavigateToTrailReportIssue: EventEmitter<string> = new EventEmitter<string>();
    @Output() onAccessibilityNotificationSelection: EventEmitter<string> = new EventEmitter<string>();
    @Output() onShowCyclingClassification: EventEmitter<void> = new EventEmitter<void>();
    @Output() onShowHikingClassification: EventEmitter<void> = new EventEmitter<void>();
    @Output() onToggleFullPageTrail: EventEmitter<void> = new EventEmitter<void>();
    @Output() onPoiClick: EventEmitter<PoiDto> = new EventEmitter<PoiDto>();
    @Output() onPoiHovering: EventEmitter<PoiDto> = new EventEmitter<PoiDto>();

    @Output() onDownloadGpx: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDownloadKml: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDownloadPdf: EventEmitter<void> = new EventEmitter<void>();
    @Output() onSelectMunicipality: EventEmitter<string> = new EventEmitter<string>();
    @Output() onNavigateToLocation: EventEmitter<Coordinates2D> = new EventEmitter<Coordinates2D>();

    isMapInitialized: boolean = true;
    opacityLow: boolean = false;



    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isMapInitialized) {
            for (const propName in changes) {
                if (propName == "sideView") {
                    if(this.sideView == ViewState.TRAIL_LIST) {
                        this.toggleFullView();
                    }
                }
            }
        }
    }

    ngAfterViewInit() : void {
        let height = GraphicUtils.getFullHeightSizeWOMenuHeights();
        document.getElementById("mobile-side-column").style.top =
            (height - this.min_panel_height) + "px";
    }


    onToggleMode() {
        this.onToggleModeClick.emit();
    }

    showMobileDetail() {
        console.log("showing details...");
        this.onDetailModeClick.emit();
    }

    toggleFullView() {
        this.showMobileDetail();
        this.isFullView = !this.isFullView;
        this.togglePanelView();
    }

    private togglePanelView() {
        const element = document.getElementById("mobile-side-column");

        if (this.isFullView) {
            element.style.top = "0px";
            element.style.height = GraphicUtils.getFullHeightSizeWOMenuHeights() + "px"
        } else {
            let height = GraphicUtils.getFullHeightSizeWOMenuHeights();
            element.style.height = this.min_panel_height + "px";
            element.style.top =
                (height - this.min_panel_height) + "px";
        }
    }
    onNavigateToLocationClick($event: PositionChangeRequest) {
        if($event.isTogglePreview) {
            this.toggleFullView();
        }
        this.onHighlightedLocation.emit($event.coordinates)
    }

    toggleOpacity() {
        this.opacityLow = !this.opacityLow;
    }


    onSelectTrail($event: string) {
        this.toggleFullView();
        setTimeout(() => {
            this.onSelectedTrailId.emit($event);
        }, 5500)
    }

    onLoadLastMaintenance($event: string) {
        this.toggleFullView();
        this.onLoadLastMaintenanceForTrail.emit($event)
    }

    onSelectPoiForTrail($event: string) {
        this.toggleFullView();
        this.onLoadPoiForTrail.emit($event)
    }

    onSelectIssue($event: string) {
        this.toggleFullView();
        this.onAccessibilityNotificationSelection.emit($event)
    }

    positionClick($event: any) {

    }
}
