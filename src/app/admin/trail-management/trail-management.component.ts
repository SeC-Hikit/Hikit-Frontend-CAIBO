import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/Status';
import { Trail } from 'src/app/Trail';
import { TrailPreviewService } from 'src/app/trail-preview-service.service';
import { TrailService } from 'src/app/trail-service.service';
import { TrailCoordinates } from 'src/app/TrailCoordinates';
import { TrailPreview } from 'src/app/TrailPreview';

@Component({
  selector: 'app-trail-management',
  templateUrl: './trail-management.component.html',
  styleUrls: ['./trail-management.component.css']
})
export class TrailManagementComponent implements OnInit {

  public trailPreviewList: TrailPreview[]
  public selectedTrail: Trail
  public selectedTrailCoords: TrailCoordinates[];
  public fileSaved: boolean;

  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllPreviews();
    
    let hasFileSaved = this.route.snapshot.paramMap.get("success");
    if(hasFileSaved) { this.onFileSave(); }
  }

  
  getAllPreviews() {
    this.trailPreviewService.getPreviews().subscribe(preview => { this.trailPreviewList = preview.trailPreviews;  } );
  }
  
  onFileSave() {
    this.fileSaved = true;
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService.getTrailByCode(selectedTrailPreview.code).subscribe(trail => {
      this.selectedTrail = trail.trails[0];
      this.selectedTrailCoords = trail.trails[0].coordinates;
    })
  }

  onDelete(selectedTrailPreview: TrailPreview) {
    let isUserCancelling = confirm("Sei sicuro di voler cancellare il sentiero '" + selectedTrailPreview.code + "'?");
    if(isUserCancelling) {
      this.trailService.deleteByCode(selectedTrailPreview.code).subscribe(r=> { if(r.status == Status.OK){ this.onDeleteSuccess(selectedTrailPreview)}});
    }
  }

  onDeleteSuccess(selectedTrailPreview: TrailPreview) {
    let i = this.trailPreviewList.indexOf(selectedTrailPreview);
    this.trailPreviewList.splice(i,1);
  }
}
