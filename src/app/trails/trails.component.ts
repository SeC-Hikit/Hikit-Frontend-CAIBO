import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Trail } from '../Trail';
import { TrailPreviewService } from '../trail-preview-service.service';
import { TrailPreview } from '../TrailPreview';
import { TrailPreviewResponse } from '../TrailPreviewResponse';

@Component({
  selector: 'app-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.css']
})
export class TrailsComponent implements OnInit {

  trailsResponse: TrailPreview[]

  constructor(private trailPreviewService : TrailPreviewService) { }

  ngOnInit(): void {
      this.getAllPreviews();
  }

  getAllPreviews() { 
    console.log("ABc");
    this.trailPreviewService.getPreviews().subscribe(preview => this.trailsResponse = preview.trailPreviews);
  }

  onOpenToMap(selectedTrailPreview: TrailPreview) {

  }

  onPreview(selectedTrailPreview: TrailPreview) {

  }
}
