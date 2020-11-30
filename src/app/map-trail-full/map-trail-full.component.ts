import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccessibilityNotification } from '../AccessibilityNotification';
import { AccessibilityNotificationUnresolved } from '../AccessibilityNotificationUnresolved';
import { Trail } from '../Trail';

@Component({
  selector: 'app-map-trail-full',
  templateUrl: './map-trail-full.component.html',
  styleUrls: ['./map-trail-full.component.css']
})
export class MapTrailFullComponent implements OnInit {

  @Input() selectedTrail: Trail;
  @Input() trailNotifications: AccessibilityNotificationUnresolved[];

  @Output() isVisibleEvent = new EventEmitter<void>();
  @Output() downloadGpxEvent = new EventEmitter<void>();
  @Output() toggleNotificationModalEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  downloadGpx(): void {
    this.downloadGpxEvent.emit();
  }

  toggleModal(): void {
    this.toggleNotificationModalEvent.emit();
  }

  toggleVisibility() : void {
    console.log("emitting");
    this.isVisibleEvent.emit();
  }


}
