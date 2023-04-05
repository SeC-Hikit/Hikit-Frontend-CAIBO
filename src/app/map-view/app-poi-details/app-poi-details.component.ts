import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PoiDto} from "../../service/poi-service.service";
import {TrailMappingDto} from "../../service/trail-service.service";

@Component({
  selector: 'app-poi-details',
  templateUrl: './app-poi-details.component.html',
  styleUrls: ['./app-poi-details.component.scss']
})
export class AppPoiDetailsComponent implements OnInit {

  @Input() selectedPoi: PoiDto;
  @Input() trailMappings: Map<string, TrailMappingDto>;
  @Output() onSelectTrail = new EventEmitter<string>();

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

  getImage(macroType: "BELVEDERE" | "SUPPORT" | "CULTURAL", microType: string[]) {
    const base_folder = "assets/cai/poi/";
    if(macroType == "BELVEDERE"){
      return base_folder + "belvedere.png"; }
    if(macroType == "SUPPORT"){
      if(microType.indexOf("fountain") >= 0) { return base_folder + "fountain.png"}
      return base_folder + "shalet.png";
    }
    if(macroType == "CULTURAL") {
      return base_folder + "ruin.png"
    }
  }
}
