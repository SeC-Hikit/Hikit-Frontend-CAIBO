import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PoiDto} from "../../service/poi-service.service";
import {TrailMappingDto} from "../../service/trail-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {

  @Input() selectedNotification: AccessibilityNotification;
  @Input() trailMappings: Map<string, TrailMappingDto>;

  constructor() { }

  ngOnInit(): void {
  }

  getImage(description: string) {
    const baseFolder = "assets/cai/poi/";

    if(description.toLowerCase().indexOf("frana") > -1) {
      return baseFolder + "frana-min.webp";
    }
    return baseFolder + "vegetazione-invadente-min.webp";
  }
}
