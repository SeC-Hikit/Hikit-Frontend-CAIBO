import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailMappingDto} from "../../../service/trail-service.service";
import {AccessibilityNotification} from "../../../service/notification-service.service";
import {PositionChangeRequest} from "../map-mobile-view.component";


@Component({
  selector: 'app-mobile-accessibility-issue-preview',
  templateUrl: './mobile-accessibility-issue-preview.component.html',
  styleUrls: ['./mobile-accessibility-issue-preview.component.scss']
})
export class MobileAccessibilityIssuePreviewComponent implements OnInit {

  @Input() accessibilityNotification: AccessibilityNotification;
  @Input() trailMappings: Map<string, TrailMappingDto>;

  @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();

  constructor() { }

  ngOnInit(): void {
  }

  getNameOrCode(id: string) {
    return this.trailMappings.get(id).name ?
        this.trailMappings.get(id).name :
        this.trailMappings.get(id).code
  }

  getColor() {
    return !this.accessibilityNotification.minor ? "#D04341" : "#ECC333";
  }
}
