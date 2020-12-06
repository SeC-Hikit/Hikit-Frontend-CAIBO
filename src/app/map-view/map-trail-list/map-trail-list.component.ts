import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { TrailPreview } from 'src/app/TrailPreview';
import { GraphicUtils } from 'src/app/utils/GraphicUtils';
@Component({
  selector: 'app-map-trail-list',
  templateUrl: './map-trail-list.component.html',
  styleUrls: ['./map-trail-list.component.css']
})
export class MapTrailListComponent implements OnInit {

  @Input() trailsPreviewList: TrailPreview[]
  @Output() selectCodeEvent = new EventEmitter<string>();
  selectedTrail: TrailPreview

  constructor() { }

  ngOnInit(): void {
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    console.log("selected" + selectedTrailPreview.code);
    this.selectCodeEvent.emit(selectedTrailPreview.code);
  }

  

}
