import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrailDto, TrailMappingDto} from "../../../service/trail-service.service";
import {AccessibilityNotification} from "../../../service/notification-service.service";
import {PositionChangeRequest} from "../map-mobile-view.component";
import {SelectTrailArgument} from "../../map.component";


@Component({
  selector: 'app-mobile-accessibility-issue-preview',
  templateUrl: './mobile-accessibility-issue-preview.component.html',
  styleUrls: ['./mobile-accessibility-issue-preview.component.scss']
})
export class MobileAccessibilityIssuePreviewComponent implements OnInit {

  @Input() accessibilityNotification: AccessibilityNotification;
  @Input() trailMappings: Map<string, TrailMappingDto>;
  @Input() previouslySelectedTrail: TrailDto;

  @Output() onNavigateToLocation: EventEmitter<PositionChangeRequest> = new EventEmitter<PositionChangeRequest>();
  @Output() onNavigateToTrail: EventEmitter<SelectTrailArgument> = new EventEmitter<SelectTrailArgument>();

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
