import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AccessibilityNotification, NotificationService, AccessibilityNotificationResolution } from 'src/app/notification-service.service';
import { Status } from 'src/app/Status';

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.scss']
})
export class AccessibilityManagementComponent implements OnInit {

  unresolvedNotifications: AccessibilityNotification[]
  solvedNotifications: AccessibilityNotification[]
  notificationSaved: string;

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute) {
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
    this.notificationService.getUnresolved().subscribe(x => { this.unresolvedNotifications = x.content; console.log(x) });
    this.notificationService.getAllResolved().subscribe(x => { this.solvedNotifications = x.content });
    let savedNotification = this.route.snapshot.paramMap.get("success") as string;
    if (savedNotification) { this.onFileSave(savedNotification); }
  }

  onFileSave(notification: string) {
    this.notificationSaved = notification;
  }

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  onDeleteClick(unresolvedNotification: AccessibilityNotification) {
    let isDeleting = confirm("Sei sicuro di voler cancellare la segnalazione in data " +
      this.formatDate(unresolvedNotification.reportDate.toString()) +
      ", per il sentiero '" + unresolvedNotification.trailId + "'?");
    if (isDeleting) {
      this.notificationService.deleteById(unresolvedNotification.id).subscribe(d => { if (d.status == Status.OK) this.onDeleted(unresolvedNotification); });
    }

  }

  onDeleted(unresolvedNotification: AccessibilityNotification): void {
    let i = this.unresolvedNotifications.indexOf(unresolvedNotification);
    this.unresolvedNotifications.splice(i, 1);
  }

  onResolveClick(unresolvedNotification: AccessibilityNotification) {
    let resDesc = "Scrivi una breve risoluzione per la segnalazione " + unresolvedNotification.id + " riportata in data '" +
      this.formatDate(unresolvedNotification.reportDate.toString()) + "' con descrizione: '" + unresolvedNotification.description + "'";
    let resolution = prompt(resDesc);

    if (resolution != null && resolution.length > 0) {
      let resolutionDate = new Date();
      this.notificationService.resolveNotification(
        { id: unresolvedNotification.id, resolution: resolution, resolutionDate: resolutionDate.toDateString() })
        .subscribe(response => { if (response.status == Status.OK) { this.onResolvedSuccess(unresolvedNotification, resolution, resolutionDate); } });
    }
  }

  onResolvedSuccess(resolvedNotification: AccessibilityNotification, resolution: string, resolutionDate: Date): void {
    this.onDeleted(resolvedNotification);
    this.solvedNotifications.push(resolvedNotification);
  }


}
