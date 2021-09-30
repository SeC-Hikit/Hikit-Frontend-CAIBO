import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AccessibilityNotification, NotificationService, AccessibilityNotificationResolution } from 'src/app/service/notification-service.service';
import { Status } from 'src/app/Status';

@Component({
  selector: 'app-accessibility-management',
  templateUrl: './accessibility-management.component.html',
  styleUrls: ['./accessibility-management.component.scss']
})
export class AccessibilityManagementComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  
  }


}
