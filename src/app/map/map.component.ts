import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessibilityNotificationUnresolved } from '../AccessibilityNotificationUnresolved';
import { NotificationService } from '../notification-service.service';
import { Trail } from '../Trail';
import { TrailPreviewService } from '../trail-preview-service.service';
import { TrailService } from '../trail-service.service';
import { TrailPreview } from '../TrailPreview';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // Bound elements
  trailPreviewList: TrailPreview[];
  selectedTrail: Trail;
  trailNotifications: AccessibilityNotificationUnresolved[];
  trailList: Trail[];
  selectedTileLayer: string;

  isTrailSelectedVisible: boolean;
  isTrailFullScreenVisible: boolean;
  isTrailListVisible: boolean;
  isAllTrailVisible: boolean;
  isNotificationModalVisible: boolean;

  constructor(
    private trailService: TrailService,
    private trailPreviewService: TrailPreviewService,
    private accessibilityService: NotificationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isTrailSelectedVisible = false;
    this.isTrailListVisible = false;
    this.isAllTrailVisible = false;
    this.isNotificationModalVisible = false;
    this.isTrailFullScreenVisible = false;
    this.changeTileLayer("topo");
    this.trailPreviewList = [];
    this.trailList = [];

    const idFromPath: string = this.route.snapshot.paramMap.get("id");
    this.loadTrail(idFromPath);
  }

  loadPreviews(): void {
    this.trailPreviewService.getPreviews().subscribe(previewResponse => { this.trailPreviewList = previewResponse.trailPreviews; console.log(this.trailPreviewList) });
  }

  loadTrail(code: string): void {
    if (code) {
      this.trailService.getTrailByCode(code).subscribe(
        trailResponse => {
          this.selectedTrail = trailResponse.trails[0];
          this.loadNotificationsForTrail(code);

          this.isTrailSelectedVisible = true;
        });
    }
  }

  loadNotificationsForTrail(code: string): void {
    this.accessibilityService.getUnresolvedByTrailByCode(code).subscribe(notificationResponse => { this.trailNotifications = notificationResponse.notifications });
  }

  loadAllTrails(): void {
    this.trailService.getTrailsLow().subscribe(trailResponse => { this.trailList = trailResponse.trails });
  }

  downloadGpx(): void {
    if (this.selectedTrail) {
      console.log("downloading...");
    }
  }

  changeTileLayer(type: string): void {
    this.selectedTileLayer = type;
  }

  toggleNotificationsModal(): void {
    this.isNotificationModalVisible = this.isNotificationModalVisible ? false : true;
  }

  toggleFullPageTrail(): void {
    this.isTrailFullScreenVisible = this.isTrailFullScreenVisible ? false : true;
  }

  toggleList(): void {
    this.isTrailListVisible = this.isTrailListVisible ? false : true;
    if (this.trailPreviewList.length == 0 && this.isTrailListVisible) {
      this.loadPreviews();
    }
  }

  toggleAllTrails(): void {
    this.isAllTrailVisible = this.isAllTrailVisible ? false : true;
    if (this.trailList.length == 0 && this.isAllTrailVisible) {
      this.loadAllTrails();
    }
  }

}
