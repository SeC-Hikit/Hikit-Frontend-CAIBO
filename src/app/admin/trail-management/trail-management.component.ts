import { Component, OnInit } from "@angular/core";
import { Status } from "src/app/Status";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { TrailCoordinates, TrailService } from "src/app/service/trail-service.service";
@Component({
  selector: "app-trail-management",
  templateUrl: "./trail-management.component.html",
  styleUrls: ["./trail-management.component.scss"],
})
export class TrailManagementComponent implements OnInit {
  entryPerPage = 10;
  page = 1;
  isLoading = false;

  selectedTrail: TrailPreview;
  selectedTrailCoords: TrailCoordinates[];
  trailPreviewList: TrailPreview[];

  savedTrailCode: string;

  constructor(
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService
  ) {}

  ngOnInit(): void {
    this.getAllPreviews();
    // TODO use toast service
    // let codeTrailSaved = this.route.snapshot.paramMap.get("success") as string;
    // if(codeTrailSaved) { this.onFileSave(codeTrailSaved); }
  }

  getAllPreviews() {
    this.isLoading = true;
    this.trailPreviewService.getPreviews(0, 10).subscribe((preview) => {
      this.isLoading = false;
      this.trailPreviewList = preview?.content;
    });
  }

  onFileSave(codeTrailSaved: string) {
    this.savedTrailCode = codeTrailSaved;
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService
      .getTrailByCode(selectedTrailPreview.code)
      .subscribe((trail) => {
        this.selectedTrail = trail.content[0];
        this.selectedTrailCoords = trail.content[0].coordinates;
      });
  }

  onDelete(selectedTrailPreview: TrailPreview) {
    let isUserCancelling = confirm(
      "Sei sicuro di voler cancellare il sentiero '" +
        selectedTrailPreview.code +
        "'?"
    );
    if (isUserCancelling) {
      this.trailService
        .deleteByCode(selectedTrailPreview.code)
        .subscribe((r) => {
          if (r.status == Status.OK) {
            this.onDeleteSuccess(selectedTrailPreview);
          }
        });
    }
  }

  onDeleteSuccess(selectedTrailPreview: TrailPreview) {
    let i = this.trailPreviewList.indexOf(selectedTrailPreview);
    this.trailPreviewList.splice(i, 1);
  }
}
