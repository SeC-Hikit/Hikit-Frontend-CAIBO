import {Component, Input, OnInit} from '@angular/core';
import {TrailMappingDto} from "../../service/trail-service.service";
import {AccessibilityNotification} from "../../service/notification-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {Help} from "../../utils/Help";

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss']
})
export class NotificationDetailsComponent implements OnInit {

  @Input() selectedNotification: AccessibilityNotification;
  @Input() trailMappings: Map<string, TrailMappingDto>;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  getImage(description: string) {
    const baseFolder = "assets/cai/poi/";

    if(description.toLowerCase().indexOf("frana") > -1) {
      return baseFolder + "frana-min.webp";
    }
    return baseFolder + "vegetazione-invadente-min.webp";
  }

  showInfoBasedOnMagnitude() {
    const modal = this.modalService.open(InfoModalComponent);
    modal.componentInstance.title = "Info su problemi di percorrenza";
    modal.componentInstance.body = Help.getDescription(this.selectedNotification.minor);
  }

}
