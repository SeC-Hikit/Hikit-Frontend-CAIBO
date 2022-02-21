import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {TrailDto, TrailService} from "../../../service/trail-service.service";
import {TrailPreview, TrailPreviewResponse, TrailPreviewService} from "../../../service/trail-preview-service.service";
import {AdminTrailService} from "../../../service/admin-trail.service";
import {AuthService} from "../../../service/auth.service";
import {Status} from "../../../Status";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-trail-view-table',
  templateUrl: './trail-view-table.component.html',
  styleUrls: ['./trail-view-table.component.scss']
})
export class TrailViewTableComponent implements OnInit {

  entryPerPage = 10;
  page = 1;
  isLoading = false;

  private destroy$ = new Subject();

  selectedTrail: TrailDto;
  isPreviewVisible: boolean = false;
  trailPreviewList: TrailPreview[];

  savedTrailCode: string;
  totalTrail: number;
  realm: string = "";

  constructor(
      private trailPreviewService: TrailPreviewService,
      private trailService: TrailService,
      private adminTrailService: AdminTrailService,
      private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getAllPreviews();
    this.realm = this.authService.getRealm();
  }

  getAllPreviews() {
    this.isLoading = true;
    this.getTrailPreviews(0, this.entryPerPage);
  }

  onFileSave(codeTrailSaved: string) {
    this.savedTrailCode = codeTrailSaved;
  }

  onPreview(selectedTrailPreview: TrailPreview) {
    this.trailService
        .getTrailById(selectedTrailPreview.id)
        .subscribe((trail) => {
          this.selectedTrail = trail.content[0];
          this.isPreviewVisible = true;
        });
  }

  onDelete(e: Event, selectedTrailPreview: TrailPreview) {
    e.stopPropagation();
    let isUserCancelling = confirm(
        "Sei sicuro di voler cancellare il sentiero '" +
        selectedTrailPreview.code +
        "'?"
    );
    if (isUserCancelling) {
      this.adminTrailService
          .deleteById(selectedTrailPreview.id)
          .subscribe((r) => {
            if (r.status == Status.OK) {
              this.onDeleteSuccess(selectedTrailPreview);
            }
          });
    }
  }

  loadTrails(page: number): void {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.getTrailPreviews(lowerBound, this.entryPerPage * page);
  }

  getTrailPreviews(skip: number, limit: number) {
    this.isLoading = true;
    this.trailPreviewService.getPreviews(skip, limit)
        .pipe(
            takeUntil(this.destroy$),
            tap(_ => this.isLoading = false)
        )
        .subscribe((preview: TrailPreviewResponse) => {
          this.totalTrail = preview.totalCount;
          this.trailPreviewList = preview.content;
        });
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  onDeleteSuccess(selectedTrailPreview: TrailPreview) {
    let i = this.trailPreviewList.indexOf(selectedTrailPreview);
    this.trailPreviewList.splice(i, 1);
  }

  getLocationsFromPreview(trailPreview: TrailPreview): string {
    if (trailPreview.locations == null) return "";
    return trailPreview.locations.map(t => t.name).join("-");
  }

  onSearch($event: string) {

  }

}
