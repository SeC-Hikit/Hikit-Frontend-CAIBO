import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AccessibilityNotification } from 'src/app/AccessibilityNotification';
import { AccessibilityNotificationUnresolved } from 'src/app/AccessibilityNotificationUnresolved';
import { NotificationService } from 'src/app/notification-service.service';
import { RestResponse } from 'src/app/RestResponse';
import { Status } from 'src/app/Status';
import { NgbdModalContent } from '../NgbdModalContent';

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

  onDeleteClick(unresolvedNotification: AccessibilityNotification) {
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

  onResolveClick(unresolvedNotification: AccessibilityNotification) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = "Resolve " + unresolvedNotification.code;
  }


}
