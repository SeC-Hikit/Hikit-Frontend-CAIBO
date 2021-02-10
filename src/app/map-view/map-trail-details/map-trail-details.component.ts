import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { AccessibilityNotification } from 'src/app/AccessibilityNotification';
import { Maintenance } from 'src/app/Maintenance';
import { Trail } from 'src/app/Trail';
import { TrailCoordinates } from 'src/app/TrailCoordinates';
import { GraphicUtils } from 'src/app/utils/GraphicUtils';

@Component({
  selector: 'app-map-trail-details',
  templateUrl: './map-trail-details.component.html',
  styleUrls: ['./map-trail-details.component.css']
})
export class MapTrailDetailsComponent implements OnInit {

  @Input() selectedTrail: Trail;
  @Input() trailNotifications: AccessibilityNotification[];
  @Input() lastMaintenance: Maintenance;

  @Output() toggleFullTrailPageEvent = new EventEmitter<void>();
  @Output() toggleNotificationListEvent = new EventEmitter<void>();
  @Output() onDownloadBinaryEvent = new EventEmitter<void>();
  @Output() onNavigateToLocation = new EventEmitter<TrailCoordinates>();


  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void { 
    let fullSize = GraphicUtils.getFullHeightSizeMenu() - 500;
    document.getElementById("scrollable-content").style.height = fullSize.toString() + "px";
  }

  toggleFullTrailPage(): void {
    this.toggleFullTrailPageEvent.emit();
  }

  toggleEventNotificationList(): void {
    this.toggleNotificationListEvent.emit();
  }

  onDownloadGpx() : void {
    this.onDownloadBinaryEvent.emit();
  }

  moveTo(location: TrailCoordinates) {
    console.log(location);
    this.onNavigateToLocation.emit(location);
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }
}
