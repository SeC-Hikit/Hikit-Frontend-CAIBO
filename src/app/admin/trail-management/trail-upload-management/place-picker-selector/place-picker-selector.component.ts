import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceDto} from "../../../../service/place.service";
import {CoordinatesDto, TrailDto} from "../../../../service/trail-service.service";
import {Marker} from "../../../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../../../assets/icons/MapPinIconType";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";


export interface PickedPlace {
    place: PlaceDto,
    pickerId: number
}

@Component({
    selector: 'app-place-picker-selector',
    templateUrl: './place-picker-selector.component.html',
    styleUrls: ['./place-picker-selector.component.scss']
})
export class PlacePickerSelectorComponent implements OnInit {

    closeResult = '';

    @Input() places: PlaceDto[];
    @Input() trail: TrailDto;
    @Input() otherTrails: TrailDto[];
    @Input() targetPoint: CoordinatesDto;
    @Output() onSelection: EventEmitter<PickedPlace> = new EventEmitter<PickedPlace>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

    targetMarker: Marker;
    selectedPlace: PlaceDto;

    constructor(public activeModal: NgbActiveModal) {
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
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

    onPlaceClick(place: PlaceDto): void {
        this.selectedPlace = place;
    }

    onSelect() {
        this.onSelection.emit(
            {
                pickerId: 0,
                place: this.selectedPlace
            });
    }
}
