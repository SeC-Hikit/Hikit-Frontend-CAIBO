import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccessibilityNotification, NotificationService } from '../service/notification-service.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent implements OnInit {

  unresolvedNotifications : AccessibilityNotification[]
  solvedNotifications : AccessibilityNotification[]

  constructor(private notificationService : NotificationService) { 
    this.unresolvedNotifications = [];
    this.solvedNotifications = [];
  }

  ngOnInit(): void {
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }
}
