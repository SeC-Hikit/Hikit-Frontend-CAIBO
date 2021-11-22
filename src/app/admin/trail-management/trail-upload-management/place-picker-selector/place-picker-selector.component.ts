import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
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
    selectedMarker: Marker;

    markers: Marker[] = [];


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
            icon: MapPinIconType.PIN,
            coords: {latitude: this.targetPoint.latitude, longitude: this.targetPoint.longitude}
        }
        this.markers.push(this.targetMarker);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {

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
        console.log(this.selectedPlace);
        this.selectedMarker = {
            icon: MapPinIconType.PIN,
            coords: {
                latitude: this.selectedPlace.coordinates[0].latitude,
                longitude: this.selectedPlace.coordinates[0].longitude
            }
        }
        if (this.markers.length > 1) {
            this.markers.pop()
        }
        this.markers = [].concat([this.selectedMarker]);
    }

    onSelect() {
        let pickedPlace = {
            pickerId: this.places.indexOf(this.selectedPlace),
            place: this.selectedPlace
        };
        console.log(pickedPlace)
        this.onSelection.emit(pickedPlace);
        this.activeModal.close('Selected place')
    }
}
