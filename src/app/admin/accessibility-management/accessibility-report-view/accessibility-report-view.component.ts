import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { AuthService } from "src/app/service/auth.service";
import {
  AccessibilityReport,
  ReportService,
} from "src/app/service/report-service.service";
import { TrailPreview, TrailPreviewService } from "src/app/service/trail-preview-service.service";
import { Trail, TrailService } from "src/app/service/trail-service.service";

@Component({
  selector: "app-accessibility-report-view",
  templateUrl: "./accessibility-report-view.component.html",
  styleUrls: ["./accessibility-report-view.component.scss"],
})
export class AccessibilityReportViewComponent implements OnInit {
  
  hasLoaded = false;
  entryPerPage = 10;
  page = 1;
  isLoading = false;
  isPreviewVisible: boolean = false;

  totalNotification: number;

  selectedTrail: Trail;
  trailPreviews: TrailPreview[];
  unresolvedNotifications: AccessibilityReport[];

  constructor(
    private authService: AuthService,
    private reportService: ReportService,
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService
  ) {
    this.unresolvedNotifications = [];
    this.trailPreviews = [];
  }

  ngOnInit(): void {
    this.loadNotification(1);
  }

  loadNotification(page: number) {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.loadSolved(lowerBound, this.entryPerPage * page);
  }

  private loadSolved(skip: number, limit: number) {
    this.reportService
      .getUnapgradedByRealm(skip, limit, this.authService.getRealm())
      .subscribe((x) => {
        this.unresolvedNotifications = x.content;
        this.unresolvedNotifications.forEach((ur) => {
          this.trailPreviewService
            .getPreview(ur.trailId)
            .subscribe((p) => this.trailPreviews.push(p.content[0]));
        });
        this.totalNotification = x.totalPages;
        this.hasLoaded = true;
      });
  }

  getTrailCode(trailId) {
    if (this.trailPreviews) {
      const filtered = this.trailPreviews.filter((tp) => tp.id == trailId);
      if (filtered.length == 1)
        return this.trailPreviews.filter((tp) => tp.id == trailId)[0].code;
    }
    return "";
  }

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  showPreview(trailId) {
    this.trailService.getTrailById(trailId).subscribe(
      trailResp => {
        this.selectedTrail = trailResp.content[0]; 
        this.togglePreview();
      }
    );
  }

  togglePreview(){
    this.isPreviewVisible = !this.isPreviewVisible;
  }
}
