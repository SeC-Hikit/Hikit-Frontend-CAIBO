import { Component, OnInit } from '@angular/core';
import { TrailPreview, TrailPreviewService } from '../service/trail-preview-service.service';
import { TrailDto, TrailCoordinatesDto, TrailService } from '../service/trail-service.service';

@Component({
  selector: 'app-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.scss']
})
export class TrailsComponent implements OnInit {

  public trailsResponse: TrailPreview[]
  public selectedTrail: TrailDto
  public selectedTrailCoords: TrailCoordinatesDto[];

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
    this.trailService.getTrailById(selectedTrailPreview.code).subscribe(trail => {
      this.selectedTrail = trail.content[0];
      this.selectedTrailCoords = trail.content[0].coordinates;
    })
  }
}
