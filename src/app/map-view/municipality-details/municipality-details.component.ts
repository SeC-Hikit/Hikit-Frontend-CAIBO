import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CoordinatesDto, TrailMappingDto} from "../../service/trail-service.service";
import {MunicipalityDetails} from "../../service/municipality.service";
import {TrailPreview} from "../../service/trail-preview-service.service";
import {LocalityDto} from "../../service/ert.service";
import {Coordinates2D} from "../../service/geo-trail-service";

@Component({
    selector: 'app-municipality-details',
    templateUrl: './municipality-details.component.html',
    styleUrls: ['./municipality-details.component.scss']
})
export class MunicipalityDetailsComponent implements OnInit {

    @Input() selectedMunicipality: MunicipalityDetails;
    @Input() selectedLocationDetails: LocalityDto;
    @Input() trailsForMunicipality: TrailPreview[];
    @Input() trailsForMunicipalityMax: number;
    @Input() trailMappings: Map<string, TrailMappingDto>;
    @Input() isPaginationToShow: boolean;
    @Output() onLoadTrailPage = new EventEmitter<number>();
    @Output() onSelectTrailCode = new EventEmitter<string>();
    @Output() onNavigateToLocation = new EventEmitter<Coordinates2D>();

    trailPreviewPage = 1;
    maxTrailEntriesPerPage = 350; // TODO: manage size and pagination


    ngOnInit(): void {
    }

    onSelectTrail($event: string) {
        this.onSelectTrailCode.emit($event);
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

    openModal(id: number, imageIndex: number): void {
    }
}
