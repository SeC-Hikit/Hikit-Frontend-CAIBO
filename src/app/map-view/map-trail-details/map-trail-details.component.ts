import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Trail } from 'src/app/Trail';
import { GraphicUtils } from 'src/app/utils/GraphicUtils';

@Component({
  selector: 'app-map-trail-details',
  templateUrl: './map-trail-details.component.html',
  styleUrls: ['./map-trail-details.component.css']
})
export class MapTrailDetailsComponent implements OnInit {

  @Input() selectedTrail: Trail;
  @Input() trailNotifications: Notification[];

  @Output() toggleFullTrailPageEvent = new EventEmitter<void>();
  @Output() toggleNotificationListEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
  }

  toggleFullTrailPage(): void {
    this.toggleFullTrailPageEvent.emit();
  }

  toggleEventNotificationList(): void {
    this.toggleNotificationListEvent.emit();
  }
}
