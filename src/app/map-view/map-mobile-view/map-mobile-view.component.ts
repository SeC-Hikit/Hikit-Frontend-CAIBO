import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TrailCoordinatesDto, TrailDto} from 'src/app/service/trail-service.service';

@Component({
    selector: 'app-map-mobile-view',
    templateUrl: './map-mobile-view.component.html',
    styleUrls: ['./map-mobile-view.component.scss']
})
export class MapMobileViewComponent implements OnInit {

    @Input() selectedTrail: TrailDto;
    @Input() isCycloSwitchOn: boolean;

    @Output() onToggleModeClick = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    onToggleMode() {
        this.onToggleModeClick.emit();
    }

    getDistance() {
        let s = this.selectedTrail.statsTrailMetadata.length;
        return Math.round(s);
    }
}
