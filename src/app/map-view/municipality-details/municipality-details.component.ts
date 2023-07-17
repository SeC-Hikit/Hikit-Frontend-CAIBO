import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailMappingDto} from "../../service/trail-service.service";
import {MunicipalityDetails} from "../../service/municipality.service";
import {TrailPreview} from "../../service/trail-preview-service.service";

@Component({
  selector: 'app-municipality-details',
  templateUrl: './municipality-details.component.html',
  styleUrls: ['./municipality-details.component.scss']
})
export class MunicipalityDetailsComponent implements OnInit {

  @Input() selectedMunicipality: MunicipalityDetails;
  @Input() trailsForMunicipality: TrailPreview[];
  @Input() trailsForMunicipalityMax: number;
  @Input() trailMappings: Map<string, TrailMappingDto>;
  @Input() isPaginationToShow: boolean;
  @Output() onLoadTrailPage = new EventEmitter<number>();
  @Output() onSelectTrailCode = new EventEmitter<string>();

  trailPreviewPage = 1;
  maxTrailEntriesPerPage = 350;


  constructor() { }

  ngOnInit(): void {
  }

  onSelectTrail($event: string) {
    this.onSelectTrailCode.emit($event);
  }

  loadTrailPreview($event: number) {
    this.onLoadTrailPage.emit($event)
  }
}
