import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceDto} from "../../../service/place.service";
import {TrailMappingDto} from "../../../service/trail-service.service";
import {PositionChangeRequest} from "../map-mobile-view.component";

@Component({
  selector: 'app-mobile-place-preview',
  templateUrl: './mobile-place-preview.component.html',
  styleUrls: ['./mobile-place-preview.component.scss']
})
export class MobilePlacePreviewComponent implements OnInit {

  @Input() place: PlaceDto;
  @Input() trailMappings: Map<string, TrailMappingDto>;

  @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();
  constructor() { }

  ngOnInit(): void {
  }

  getNameOrCode(id: string) {
    return this.trailMappings.get(id).name ?
        this.trailMappings.get(id).name :
        this.trailMappings.get(id).code
  }

}
