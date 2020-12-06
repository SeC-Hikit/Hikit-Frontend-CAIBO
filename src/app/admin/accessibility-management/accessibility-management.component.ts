import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccessibilityNotification } from 'src/app/AccessibilityNotification';
import { AccessibilityNotificationUnresolved } from 'src/app/AccessibilityNotificationUnresolved';
import { NotificationService } from 'src/app/notification-service.service';

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.css']
})
export class AccessibilityManagementComponent implements OnInit {

  unresolvedNotifications : AccessibilityNotificationUnresolved[]
  solvedNotifications : AccessibilityNotification[]

  constructor(private notificationService : NotificationService) { 
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
    const notificationResponseUnresolved = this.notificationService.getUnresolved().subscribe(x=> { this.unresolvedNotifications = x.accessibilityNotifications; });
    const notificationResponseResolved = this.notificationService.getAllResolved().subscribe(x=> { this.solvedNotifications = x.accessibilityNotifications }); 
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }


}
