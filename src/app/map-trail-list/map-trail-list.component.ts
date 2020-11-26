import { Component, OnInit } from '@angular/core';
import { TrailPreviewResponse } from '../TrailPreviewResponse';

@Component({
  selector: 'app-map-trail-list',
  templateUrl: './map-trail-list.component.html',
  styleUrls: ['./map-trail-list.component.css']
})
export class MapTrailListComponent implements OnInit {

  trailPreviewResponse$ : TrailPreviewResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
