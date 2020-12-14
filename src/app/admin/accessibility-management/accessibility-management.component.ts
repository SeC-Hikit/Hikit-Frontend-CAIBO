import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ok } from 'assert';
import * as moment from 'moment';
import { AccessibilityComponent } from 'src/app/accessibility/accessibility.component';
import { AccessibilityNotification } from 'src/app/AccessibilityNotification';
import { AccessibilityNotificationObj } from 'src/app/AccessibilityNotificationObj';
import { AccessibilityNotificationResolution } from 'src/app/AccessibilityNotificationResolution';
import { AccessibilityNotificationUnresolved } from 'src/app/AccessibilityNotificationUnresolved';
import { NotificationService } from 'src/app/notification-service.service';
import { RestResponse } from 'src/app/RestResponse';
import { Status } from 'src/app/Status';

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.css']
})
export class AccessibilityManagementComponent implements OnInit {

  unresolvedNotifications: AccessibilityNotificationUnresolved[]
  solvedNotifications: AccessibilityNotification[]

  constructor(private notificationService: NotificationService, private modalService: NgbModal) {
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
    const notificationResponseUnresolved = this.notificationService.getUnresolved().subscribe(x => { this.unresolvedNotifications = x.accessibilityNotifications; });
    const notificationResponseResolved = this.notificationService.getAllResolved().subscribe(x => { this.solvedNotifications = x.accessibilityNotifications });
  }

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  onDeleteClick(unresolvedNotification: AccessibilityNotificationUnresolved) {
    let isDeleting = confirm("Sei sicuro di voler cancellare la segnalazione in data " +
      this.formatDate(unresolvedNotification.reportDate.toString()) +
      ", per il sentiero '" + unresolvedNotification.code + "'?");
    if (isDeleting) {
      this.notificationService.deleteById(unresolvedNotification._id).subscribe(d => { if (d.status == Status.OK) this.onDeleted(unresolvedNotification); });
    }

  }

  onDeleted(unresolvedNotification: AccessibilityNotificationUnresolved): void {
    let i = this.unresolvedNotifications.indexOf(unresolvedNotification);
    this.unresolvedNotifications.splice(i, 1);
  }

  onResolveClick(unresolvedNotification: AccessibilityNotificationUnresolved) {
    let resDesc = "Scrivi una breve risoluzione per la segnalazione " + unresolvedNotification.code + " riportata in data '" +
      this.formatDate(unresolvedNotification.reportDate.toString()) + "' con descrizione: '" + unresolvedNotification.description + "'";
    let resolution = prompt(resDesc);
    if (resolution.length > 0) {
      let resolutionDate = new Date();
      this.notificationService.resolveNotification(new AccessibilityNotificationResolution(unresolvedNotification._id, resolution, resolutionDate))
        .subscribe(response => { if (response.status == Status.OK) { this.onResolvedSuccess(unresolvedNotification, resolution, resolutionDate); } });
    }
  }

  onResolvedSuccess(resolvedNotification: AccessibilityNotificationUnresolved, resolution: string, resolutionDate: Date): void {
    this.onDeleted(resolvedNotification);
    this.solvedNotifications.push(new AccessibilityNotificationObj(resolvedNotification._id, 
      resolvedNotification.code, resolvedNotification.description, 
      resolvedNotification.reportDate, resolutionDate, resolvedNotification.isMinor, resolution));
  }


}
