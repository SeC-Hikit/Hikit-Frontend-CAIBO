import {Component, Input, OnInit} from '@angular/core';
import {PoiDto} from "../../service/poi-service.service";

@Component({
  selector: 'app-poi-details',
  templateUrl: './app-poi-details.component.html',
  styleUrls: ['./app-poi-details.component.scss']
})
export class AppPoiDetailsComponent implements OnInit {

  @Input() selectedPoi: PoiDto;

  constructor() { }

  ngOnInit(): void {
  }

}
