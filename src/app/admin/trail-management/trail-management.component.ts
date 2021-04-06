import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrailRaw } from 'src/app/import.service';
import { Status } from 'src/app/Status';
import { TrailPreview, TrailPreviewService } from 'src/app/trail-preview-service.service';
import { TrailRawService } from 'src/app/trail-raw-service.service';
import { TrailCoordinates, TrailService } from 'src/app/trail-service.service';
import { DateUtils } from 'src/app/utils/DateUtils';
@Component({
  selector: 'app-trail-management',
  templateUrl: './trail-management.component.html',
  styleUrls: ['./trail-management.component.scss']
})
export class TrailManagementComponent implements OnInit {

  public entryPerPage: number = 10;
  public page: number = 1;

  public selectedTrail: TrailPreview
  public selectedTrailCoords: TrailCoordinates[];
  public trailPreviewList: TrailPreview[]

  public savedTrailCode: string;



  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService,
    private trailRawService: TrailRawService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllPreviews();

    // TODO use toast service
    // let codeTrailSaved = this.route.snapshot.paramMap.get("success") as string;
    // if(codeTrailSaved) { this.onFileSave(codeTrailSaved); }
  }

  getAllPreviews() {
    this.trailPreviewService.getPreviews().subscribe(preview => { this.trailPreviewList = preview.content;  } );
  }
  

  onFileSave(codeTrailSaved : string) {
    this.savedTrailCode = codeTrailSaved;
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService.getTrailByCode(selectedTrailPreview.code).subscribe(trail => {
      this.selectedTrail = trail.content[0];
      this.selectedTrailCoords = trail.content[0].coordinates;
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
