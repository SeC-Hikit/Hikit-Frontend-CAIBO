import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceDto} from "../../../service/place.service";
import {TrailDto, TrailMappingDto} from "../../../service/trail-service.service";
import {PositionChangeRequest} from "../map-mobile-view.component";
import {SelectTrailArgument} from "../../map.component";

@Component({
  selector: 'app-mobile-place-preview',
  templateUrl: './mobile-place-preview.component.html',
  styleUrls: ['./mobile-place-preview.component.scss']
})
export class MobilePlacePreviewComponent implements OnInit {

  @Input() place: PlaceDto;
  @Input() trailMappings: Map<string, TrailMappingDto>;
  @Input() previouslySelectedTrail: TrailDto;

  @Output() onNavigateToTrail: EventEmitter<SelectTrailArgument> = new EventEmitter<SelectTrailArgument>();
  @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();
  constructor() { }

  ngOnInit(): void {
  }

  getNameOrCode(id: string) {
    return this.trailMappings.get(id).name ?
        this.trailMappings.get(id).name :
        this.trailMappings.get(id).code
  }

  onNavigateToTrailClick(id: string) {
    this.onNavigateToTrail.emit({id, refresh: false, zoomIn: true, switchView: true});
  }

}
