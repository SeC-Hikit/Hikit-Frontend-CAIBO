import {Component, Input, OnInit} from '@angular/core';
import {TrailDto} from "../../../service/trail-service.service";

@Component({
  selector: 'app-mobile-trail-preview',
  templateUrl: './mobile-trail-preview.component.html',
  styleUrls: ['./mobile-trail-preview.component.scss']
})
export class MobileTrailPreviewComponent implements OnInit {

  @Input() trail: TrailDto;

  constructor() { }

  ngOnInit(): void {
  }

  getDistance() {
    let s = this.trail.statsTrailMetadata.length;
    return Math.round(s);
  }

}
