import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailDto, TrailMappingDto} from "../../../service/trail-service.service";
import {PoiDto} from "../../../service/poi-service.service";
import {PoiUtils} from "../../PoiUtils";
import {PositionChangeRequest} from "../map-mobile-view.component";
import {SelectTrailArgument} from "../../map.component";

@Component({
    selector: 'app-mobile-poi-preview',
    templateUrl: './mobile-poi-preview.component.html',
    styleUrls: ['./mobile-poi-preview.component.scss']
})
export class MobilePoiPreviewComponent implements OnInit {

    @Input() poi: PoiDto;
    @Input() trailMappings: Map<string, TrailMappingDto>;
    @Input() previouslySelectedTrail: TrailDto;
    @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();
    @Output() onNavigateToTrail: EventEmitter<SelectTrailArgument> = new EventEmitter<SelectTrailArgument>();

    constructor() {
    }

    ngOnInit(): void {
    }

    getNameOrCode(id: string) {
        return this.trailMappings.get(id).name ?
            this.trailMappings.get(id).name :
            this.trailMappings.get(id).code
    }

    getImage(macroType: "BELVEDERE" | "SUPPORT" | "CULTURAL" | "CURIOSITY", microType: string[]) {
        return PoiUtils.getImage(macroType, microType);
    }

    onNavigateToTrailClick(id: string) {
        this.onNavigateToTrail.emit({id, refresh: false, zoomIn: true, switchView: true});
    }
}
