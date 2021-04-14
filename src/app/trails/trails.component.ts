import { Component, OnInit } from '@angular/core';
import { TrailPreview, TrailPreviewService } from '../trail-preview-service.service';
import { Trail, TrailCoordinates, TrailService } from '../trail-service.service';

@Component({
  selector: 'app-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.scss']
})
export class TrailsComponent implements OnInit {

  public trailsResponse: TrailPreview[]
  public selectedTrail: Trail
  public selectedTrailCoords: TrailCoordinates[];

  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService) { }

  ngOnInit(): void {
    this.getAllPreviews();
  }

  ngOnAfterViewInit(): void {
  }

  getAllPreviews() {
    this.trailPreviewService.getPreviews(0, 10).subscribe(preview => { this.trailsResponse = preview.content; });
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService.getTrailByCode(selectedTrailPreview.code).subscribe(trail => {
      this.selectedTrail = trail.content[0];
      this.selectedTrailCoords = trail.content[0].coordinates;
    })
  }
}
