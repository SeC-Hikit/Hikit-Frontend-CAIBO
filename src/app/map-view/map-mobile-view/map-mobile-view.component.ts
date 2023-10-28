import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TrailDto} from 'src/app/service/trail-service.service';
import {Coordinates2D} from "../../service/geo-trail-service";
import {TrailPreview} from "../../service/trail-preview-service.service";
import {GraphicUtils} from "../../utils/GraphicUtils";
import {PoiDto} from "../../service/poi-service.service";
import {ViewState} from "../MapUtils";

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

    isMapInitialized: boolean = true;

    constructor() { }

    ngOnInit(): void {

    }

    ngAfterViewInit() : void {
        this.setLowerPanelSize();
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
        const element = document.getElementById("mobile-side-column");

        if(this.isFullView) {
            element.style.top = "0px";
            element.style.height = GraphicUtils.getFullHeightSizeWOMenuHeights() + "px"
        } else {
            this.setLowerPanelSize();
        }
    }

    private setLowerPanelSize() {
        let height = GraphicUtils.getFullHeightSizeWOMenuHeights();
        document.getElementById("mobile-side-column").style.top =
            (height - this.min_panel_height) + "px";
    }

}
