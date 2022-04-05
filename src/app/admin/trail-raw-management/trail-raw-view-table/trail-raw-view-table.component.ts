import { Component, OnInit } from '@angular/core';
import {TrailPreview, TrailPreviewService} from "../../../service/trail-preview-service.service";
import {Subject} from "rxjs";
import {AdminTrailRawService} from "../../../service/admin-trail-raw.service";
import {ImportService, TrailRawResponse} from "../../../service/import.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {takeUntil, tap} from "rxjs/operators";
import {DateUtils} from "../../../utils/DateUtils";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-trail-raw-view-table',
  templateUrl: './trail-raw-view-table.component.html',
  styleUrls: ['./trail-raw-view-table.component.scss']
})
export class TrailRawViewTableComponent implements OnInit {

  public entryPerPage = 10;
  public page: number;

  public trailRawList: TrailPreview[] = [];
  public totalRaw: number;

  public isLoading = true;

  private destroy$ = new Subject();
  private realm: string;

  constructor(
      private trailRawService: AdminTrailRawService,
      private importService: ImportService,
      private trailPreviewService: TrailPreviewService,
      private modalService: NgbModal,
      private router: Router,
      private authService: AuthService
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    this.realm = this.authService.getInstanceRealm()
    this.loadRawTrails(1);
  }

  getTrailRawPreviews(skip: number, limit: number, realm?: string) {
    this.trailPreviewService
        .getRawPreviews(skip, limit, realm)
        .pipe(
            takeUntil(this.destroy$),
            tap((_) => (this.isLoading = false))
        )
        .subscribe((preview) => {
          this.totalRaw = preview.totalCount;
          this.trailRawList = preview.content;
        });
  }

  loadRawTrails(page: number): void {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.getTrailRawPreviews(lowerBound,
        this.entryPerPage * page,
        this.realm);
  }

  uploadFile(file: FileList): void {
    this.isLoading = true;
    console.log(file);
    this.importService
        .readTrail(file[0])
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: TrailRawResponse) => {
          this.isLoading = false;
          if (response.status == 'ERROR') {
            this.openError("Error con upload dei .gpx",
                "Errore con l'upload dei file(s): " + response.messages);
            return;

          }
          console.log(response.content[0].id);
          this.navigateToEdit(response.content[0].id);
        });
  }

  uploadFiles(files: FileList): void {
    this.isLoading = true;
    this.importService
        .readTrails(files)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          if (response.status == 'ERROR') {
            this.openError("Error con upload dei .gpx",
                "Errore con l'upload dei file(s): " + response.messages);
          }
          this.loadRawTrails(this.page);
        });
  }

  deleteRawTrail(id: string): void {
    this.isLoading = true;
    this.trailRawService
        .deleteById(id)
        .pipe(
            takeUntil(this.destroy$),
            tap((_) => (this.isLoading = false))
        )
        .subscribe((_) => {
          this.trailRawList = this.trailRawList.filter((tr) => tr.id !== id);
          this.loadRawTrails(this.page);
        });
  }

  navigateToEdit(rawId: string) {
    this.router.navigate(["/admin/raw-trail-management/init/" + rawId]);
  }

  formatDate(stringDate: string) {
    return DateUtils.formatDateToDay(stringDate);
  }

  private openError(title: string, body: string) {
    const modal = this.modalService.open(InfoModalComponent);
    modal.componentInstance.title = title;
    modal.componentInstance.body = body;
  }

}
