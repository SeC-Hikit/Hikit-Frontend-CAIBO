import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MunicipalityDto} from "../../../service/municipality.service";
import {LocalityDto} from "../../../service/ert.service";
import {PositionChangeRequest} from "../map-mobile-view.component";

@Component({
  selector: 'app-mobile-municipality-preview',
  templateUrl: './mobile-municipality-preview.component.html',
  styleUrls: ['./mobile-municipality-preview.component.scss']
})
export class MobileMunicipalityPreviewComponent implements OnInit {

  @Input() municipality: MunicipalityDto;
  @Input() selectedLocationDetails: LocalityDto;
  @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();

  constructor() { }

  ngOnInit(): void {
  }

}
