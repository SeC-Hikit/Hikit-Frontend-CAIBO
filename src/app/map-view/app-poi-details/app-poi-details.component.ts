import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PoiDto} from "../../service/poi-service.service";
import {TrailMappingDto} from "../../service/trail-service.service";
import {PoiEnums} from "../../admin/poi-management/PoiEnums";

@Component({
    selector: 'app-poi-details',
    templateUrl: './app-poi-details.component.html',
    styleUrls: ['./app-poi-details.component.scss']
})
export class AppPoiDetailsComponent implements OnInit {

    @Input() selectedPoi: PoiDto;
    @Input() trailMappings: Map<string, TrailMappingDto>;
    @Output() onSelectTrail = new EventEmitter<string>();
    @Output() onHighlightTrail = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    navigateToTrail(trailId: string) {
        this.onSelectTrail.emit(trailId);
    }

    getNameOrCode(id: string) {
        return this.trailMappings.get(id).name ?
            this.trailMappings.get(id).name :
            this.trailMappings.get(id).code
    }

    getImage(macroType: "BELVEDERE" | "SUPPORT" | "CULTURAL", microType: string[]) {
        const base_folder = "assets/cai/poi/";

        if(macroType == "BELVEDERE") {
            return base_folder + "belvedere.png";
        }
        const microtypes = PoiEnums.macroTypes.filter((it) => it.value == macroType)[0].micro;
        const foundMicrotype = microtypes.filter(it=> it.value == microType[0]);
        return base_folder + foundMicrotype[0].image
    }

    onRelatedTrailHover(id: string) {
        this.onHighlightTrail.emit(id);
    }
}
