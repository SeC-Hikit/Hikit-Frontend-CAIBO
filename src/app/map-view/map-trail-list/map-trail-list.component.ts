import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { TrailPreview } from 'src/app/service/trail-preview-service.service';
@Component({
  selector: 'app-map-trail-list',
  templateUrl: './map-trail-list.component.html',
  styleUrls: ['./map-trail-list.component.scss']
})
export class MapTrailListComponent implements OnInit {

  @Input() trailsPreviewList: TrailPreview[]
  @Output() onSelectTrail = new EventEmitter<string>();

  selectedTrail: TrailPreview;

  constructor() { }

  ngOnInit(): void {
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.onSelectTrail.emit(selectedTrailPreview.id);
  }

  

}
