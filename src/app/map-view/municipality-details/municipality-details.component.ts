import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CoordinatesDto, TrailMappingDto} from "../../service/trail-service.service";
import {MunicipalityDto} from "../../service/municipality.service";
import {TrailPreview} from "../../service/trail-preview-service.service";
import {LocalityDto} from "../../service/ert.service";
import {Coordinates2D} from "../../service/geo-trail-service";
import {SelectTrailArgument} from "../map.component";
import {components} from "../../../binding/Binding";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventModalComponent} from "../../modal/event-modal/event-modal.component";

export type EventDto = components["schemas"]["EventDto"];

@Component({
    selector: 'app-municipality-details',
    templateUrl: './municipality-details.component.html',
    styleUrls: ['./municipality-details.component.scss']
})
export class MunicipalityDetailsComponent implements OnInit {

    @Input() selectedMunicipality: MunicipalityDto;
    @Input() selectedMunicipalityEvents: EventDto[];
    @Input() selectedLocationDetails: LocalityDto;
    @Input() trailsForMunicipality: TrailPreview[];
    @Input() trailsForMunicipalityMax: number;
    @Input() trailMappings: Map<string, TrailMappingDto>;
    @Input() isPaginationToShow: boolean;
    @Output() onLoadTrailPage = new EventEmitter<number>();
    @Output() onSelectTrailCode = new EventEmitter<SelectTrailArgument>();
    @Output() onNavigateToLocation = new EventEmitter<Coordinates2D>();
    @Output() onSelectMunicipalityEvent = new EventEmitter<EventDto>();


    trailPreviewPage = 1;
    maxTrailEntriesPerPage = 350; // TODO: manage size and pagination

    constructor(private modalService: NgbModal) {

    }

    ngOnInit(): void {
    }

    onSelectEvent($event: EventDto): void {
        const modal = this.modalService.open(EventModalComponent);
        modal.componentInstance.event = $event;
    }

    onSelectTrail($event: string) {
        this.onSelectTrailCode.emit(
            { id: $event, switchView: false, zoomIn: true, refresh: false });
    }

    loadTrailPreview($event: number) {
        this.onLoadTrailPage.emit($event)
    }

    navigateToLocation($event: CoordinatesDto) {
        this.onNavigateToLocation.emit({
            latitude: $event.latitude,
            longitude: $event.longitude
        });
    }

}
