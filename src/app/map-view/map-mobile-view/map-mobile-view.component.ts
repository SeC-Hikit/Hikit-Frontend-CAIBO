import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TrailCoordinatesDto, TrailDto} from 'src/app/service/trail-service.service';
import {Coordinates2D} from "../../service/geo-trail-service";
import {TrailPreview} from "../../service/trail-preview-service.service";

@Component({
    selector: 'app-map-mobile-view',
    templateUrl: './map-mobile-view.component.html',
    styleUrls: ['./map-mobile-view.component.scss']
})
export class MapMobileViewComponent implements OnInit {

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

    isMapInizialized: boolean = true;

    constructor() { }

    ngOnInit(): void {
    }

    onToggleMode() {
        this.onToggleModeClick.emit();
    }

    showMobileDetail() {
        console.log("showing details...");
        this.onDetailModeClick.emit();
    }

    getDistance() {
        let s = this.selectedTrail.statsTrailMetadata.length;
        return Math.round(s);
    }

}
