import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailMappingDto} from "../../service/trail-service.service";
import {PlaceDto} from "../../service/place.service";

@Component({
  selector: 'app-place-details',
  templateUrl: './app-place-details.component.html',
  styleUrls: ['./app-place-details.component.scss']
})
export class AppPlaceDetailsComponent implements OnInit {

  @Input() selectedPlace: PlaceDto;
  @Input() trailMappings: Map<string, TrailMappingDto>;
  @Output() onSelectTrail = new EventEmitter<string>();
  @Output() onHighlightTrail = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

  navigateToTrail(trailId: string) {
    this.onSelectTrail.emit(trailId);
  }

  getNameOrCode(id: string) {
    return this.trailMappings.get(id).name ?
        this.trailMappings.get(id).name :
        this.trailMappings.get(id).code
  }

  getImage() {
    const base_folder = "assets/cai/place/";
    return base_folder + "sign.webp"
  }

  onRelatedTrailHover(id: string) {
    this.onHighlightTrail.emit(id);
  }
}
