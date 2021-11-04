import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceDto} from "../../../../service/place.service";
import {CoordinatesDto, TrailDto} from "../../../../service/trail-service.service";
import {Marker} from "../../../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../../../assets/icons/MapPinIconType";

@Component({
    selector: 'app-place-picker-selector',
    templateUrl: './place-picker-selector.component.html',
    styleUrls: ['./place-picker-selector.component.scss']
})
export class PlacePickerSelectorComponent implements OnInit {

    @Input() places: PlaceDto[];
    @Input() trail: TrailDto;
    @Input() targetPoint: CoordinatesDto;
    @Output() onSelection: EventEmitter<PlaceDto> = new EventEmitter<PlaceDto>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

    targetMarker: Marker;

    constructor() {
    }

    ngOnInit(): void {
        this.targetMarker = {
            icon: MapPinIconType.RED_PIN,
            coords: {latitude: this.targetPoint.latitude, longitude: this.targetPoint.longitude}
        }
    }

    onClose() {
        this.onCancelEvent();
    }

    onCancelEvent(): void {
        this.onCancel.emit();
    }

    onSelect(place: PlaceDto) {
        // todo show preview
    }
}
