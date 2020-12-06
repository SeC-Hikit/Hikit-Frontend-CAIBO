import { Component, OnInit } from '@angular/core';
import { Trail } from 'src/app/Trail';
import { TrailPreviewService } from 'src/app/trail-preview-service.service';
import { TrailService } from 'src/app/trail-service.service';
import { TrailPreview } from 'src/app/TrailPreview';

@Component({
  selector: 'app-trail-management',
  templateUrl: './trail-management.component.html',
  styleUrls: ['./trail-management.component.css']
})
export class TrailManagementComponent implements OnInit {

  public trailsResponse: TrailPreview[]
  public selectedTrail: Trail

  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService) { }

  ngOnInit(): void {
    this.getAllPreviews();
  }

  ngOnAfterViewInit(): void {
  }

  getAllPreviews() {
    this.trailPreviewService.getPreviews().subscribe(preview => { this.trailsResponse = preview.trailPreviews;  } );
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService.getTrailByCode(selectedTrailPreview.code).subscribe(trail => this.selectedTrail = trail.trails[0])
  }

  onDelete(selectedTrailPreview: TrailPreview) {
    console.log("Delete");
  }
}
