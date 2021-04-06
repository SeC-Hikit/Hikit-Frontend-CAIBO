import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrailPreview, TrailPreviewService } from 'src/app/trail-preview-service.service';
import { TrailRawService } from 'src/app/trail-raw-service.service';
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { DateUtils } from 'src/app/utils/DateUtils';
import { ImportService, TrailRawResponse } from 'src/app/import.service';
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

@Component({
  selector: 'app-trail-raw-management',
  templateUrl: './trail-raw-management.component.html',
  styleUrls: ['./trail-raw-management.component.scss']
})
export class TrailRawManagementComponent implements OnInit, OnDestroy {

  public entryPerPage = 10
  public page: number;

  public trailRawList: TrailPreview[]
  public totalRaw: number;

  isLoading = false;

  private destroy$ = new Subject();

  constructor(
    private trailRawService: TrailRawService,
    private importService: ImportService,
    private trailPreviewService: TrailPreviewService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    this.loadRawTrails(1);
  }

  getTrailRawPreviews(skip: number, limit: number) {
    this.trailPreviewService.getRawPreviews(skip, limit).subscribe(preview => {
      this.totalRaw = preview.totalCount;
      this.trailRawList = preview.content;
    });
  }

  loadRawTrails(page: number): void {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.getTrailRawPreviews(lowerBound, this.entryPerPage);
  }

  uploadFile(files: File[]): void {
    this.isLoading = true;
    this.importService
      .readTrail(files[0])
      .pipe(takeUntil(this.destroy$))
      .subscribe((trailRawResponse: TrailRawResponse) => {
        this.isLoading = false;
        // this.uploadedSuccessful = true;
      });
}

uploadFiles(files: FileList): void {
  this.importService
  .readTrails(files)
  .pipe(takeUntil(this.destroy$))
  .subscribe((_) => {
    this.isLoading = false;
    // this.uploadedSuccessful = true;
  });
}

  formatDate(stringDate: string) {
    return DateUtils.formatDateToDay(stringDate)
  }
}
