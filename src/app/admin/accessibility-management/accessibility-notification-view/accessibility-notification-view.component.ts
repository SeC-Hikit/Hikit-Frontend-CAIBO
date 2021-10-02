import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { Subject } from "rxjs";
import {
  AccessibilityNotification,
  NotificationService,
} from "src/app/service/notification-service.service";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { Trail, TrailService } from "src/app/service/trail-service.service";
import { Status } from "src/app/Status";

@Component({
  selector: "app-accessibility-notification-view",
  templateUrl: "./accessibility-notification-view.component.html",
  styleUrls: ["./accessibility-notification-view.component.scss"],
})
export class AccessibilityNotificationViewComponent implements OnInit {
  entryPerPage = 10;
  page = 1;
  isLoading = false;
  totalNotification: number;

  private destroy$ = new Subject();
  
  isPreviewVisible: boolean = false;
  hasLoaded = false;

  trailPreviews: TrailPreview[] = [];
  selectedTrail: Trail;
  unresolvedNotifications: AccessibilityNotification[];
  solvedNotifications: AccessibilityNotification[];
  notificationSaved: string;

  constructor(
    private notificationService: NotificationService,
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService
  ) {
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
    this.loadNotification(1);
  }

  onFileSave(notification: string) {
    this.notificationSaved = notification;
  }

  loadNotification(page: number) {
    this.page = page;
    const lowerBound = this.entryPerPage * (page - 1);
    this.loadSolved(lowerBound, this.entryPerPage);
  }

  private loadSolved(skip: number, limit: number) {
    this.notificationService.getUnresolved(skip, limit).subscribe((x) => {
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

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  onDeleteClick(unresolvedNotification: AccessibilityNotification) {
    let isDeleting = confirm(
      "Sei sicuro di voler cancellare la segnalazione in data " +
        this.formatDate(unresolvedNotification.reportDate.toString()) +
        ", per il sentiero '" +
        unresolvedNotification.trailId +
        "'?"
    );
    if (isDeleting) {
      this.notificationService
        .deleteById(unresolvedNotification.id)
        .subscribe((d) => {
          if (d.status == Status.OK) this.onDeleted(unresolvedNotification);
        });
    }
  }

  onDeleted(unresolvedNotification: AccessibilityNotification): void {
    let i = this.unresolvedNotifications.indexOf(unresolvedNotification);
    this.unresolvedNotifications.splice(i, 1);
  }

  onResolveClick(unresolvedNotification: AccessibilityNotification) {
    let resDesc =
      "Scrivi una breve risoluzione per la segnalazione " +
      unresolvedNotification.id +
      " riportata in data '" +
      this.formatDate(unresolvedNotification.reportDate.toString()) +
      "' con descrizione: '" +
      unresolvedNotification.description +
      "'";
    let resolution = prompt(resDesc);

    if (resolution != null && resolution.length > 0) {
      let resolutionDate = new Date();
      this.notificationService
        .resolveNotification({
          id: unresolvedNotification.id,
          resolution: resolution,
          resolutionDate: resolutionDate.toDateString(),
        })
        .subscribe((response) => {
          if (response.status == Status.OK) {
            this.onResolvedSuccess(
              unresolvedNotification,
              resolution,
              resolutionDate
            );
          }
        });
    }
  }

  getTrailCode(trailId) {
    if (this.trailPreviews) {
      const filtered = this.trailPreviews.filter((tp) => tp.id == trailId);
      if (filtered.length == 1)
        return this.trailPreviews.filter((tp) => tp.id == trailId)[0].code;
    }
    return "";
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

  onResolvedSuccess(
    resolvedNotification: AccessibilityNotification,
    resolution: string,
    resolutionDate: Date
  ): void {
    this.onDeleted(resolvedNotification);
    this.solvedNotifications.push(resolvedNotification);
  }
}
