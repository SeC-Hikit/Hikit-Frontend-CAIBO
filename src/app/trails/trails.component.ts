import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Trail } from '../Trail';
import { TrailPreview } from '../TrailPreview';

@Component({
  selector: 'app-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.css']
})
export class TrailsComponent implements OnInit {

  trailsResponse$: Observable<TrailPreview[]>

  constructor() { }

  ngOnInit(): void {
      
  }

  onOpenToMap(selectedTrailPreview: TrailPreview) {

  }

  onPreview(selectedTrailPreview: TrailPreview) {

  }
}
