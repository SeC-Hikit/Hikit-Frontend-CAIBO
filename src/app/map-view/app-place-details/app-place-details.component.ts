import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailMappingDto} from "../../service/trail-service.service";
import {PlaceDto} from "../../service/place.service";
import {Media} from "../../service/media-service.service";

@Component({
  selector: 'app-place-details',
  templateUrl: './app-place-details.component.html',
  styleUrls: ['./app-place-details.component.scss']
})
export class AppPlaceDetailsComponent implements OnInit {

  @Input() mediaDto: Media[];
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
    try {
      return this.trailMappings.get(id).name ?
          this.trailMappings.get(id).name :
          this.trailMappings.get(id).code
    } catch (e) {
      return "";
    }
  }

  getImage() {
    const base_folder = "assets/cai/place/";
    return base_folder + "sign.webp"
  }

  onRelatedTrailHover(id: string) {
    this.onHighlightTrail.emit(id);
  }
}
