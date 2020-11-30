import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../notification-service.service';
import { Trail } from '../Trail';

@Component({
  selector: 'app-map-trail-details',
  templateUrl: './map-trail-details.component.html',
  styleUrls: ['./map-trail-details.component.css']
})
export class MapTrailDetailsComponent implements OnInit {

  @Input() selectedTrail: Trail;
  @Input() trailNotifications : Notification[];

  @Output() toggleFullTrailPageEvent = new EventEmitter<void>();
  @Output() toggleNotificationListEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    
  }

  toggleFullTrailPage(): void {
    console.log("tac");
    this.toggleFullTrailPageEvent.emit();
  }

  toggleEventNotificationList(): void {
    this.toggleNotificationListEvent.emit();
  }
}
