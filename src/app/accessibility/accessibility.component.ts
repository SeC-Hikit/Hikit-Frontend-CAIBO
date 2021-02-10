import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccessibilityNotification } from '../AccessibilityNotification';
import { AccessibilityNotificationUnresolved } from '../AccessibilityNotificationUnresolved';
import { NotificationService } from '../notification-service.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent implements OnInit {

  unresolvedNotifications : AccessibilityNotificationUnresolved[]
  solvedNotifications : AccessibilityNotification[]

  constructor(private notificationService : NotificationService) { 
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
    const notificationResponseUnresolved = this.notificationService.getUnresolved().subscribe(x=> { this.unresolvedNotifications = x.content; });
    const notificationResponseResolved = this.notificationService.getAllResolved().subscribe(x=> { this.solvedNotifications = x.content }); 
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }

}
