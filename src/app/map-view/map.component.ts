import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessibilityNotificationUnresolved } from '../AccessibilityNotificationUnresolved';
import { Maintenance } from '../Maintenance';
import { MaintenanceService } from '../maintenance.service';
import { NotificationService } from '../notification-service.service';
import { Trail } from '../Trail';
import { TrailPreviewService } from '../trail-preview-service.service';
import { TrailService } from '../trail-service.service';
import { TrailPreview } from '../TrailPreview';
import { UserCoordinates } from '../UserCoordinates';
import { GraphicUtils } from '../utils/GraphicUtils';
import *  as FileSaver from 'file-saver';
import { TrailCoordinates } from '../TrailCoordinates';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  static TRAIL_LIST_COLUMN_ID = "trail-list-column"
  static TRAIL_DETAILS_ID = "trail-detail-column";

  // Bound elements
  trailPreviewList: TrailPreview[];
  selectedTrail: Trail;
  selectedTrailBinaryPath: string;
  trailNotifications: AccessibilityNotificationUnresolved[];
  lastMaintenance: Maintenance;
  trailList: Trail[];
  selectedTileLayer: string;
  userPosition: UserCoordinates;
  highlightedLocation: TrailCoordinates;

  isTrailSelectedVisible: boolean;
  isTrailFullScreenVisible: boolean;
  isTrailListVisible: boolean;
  isAllTrailVisible: boolean;
  isNotificationModalVisible: boolean;
  isUserPositionToggled: boolean;

  constructor(
    private trailService: TrailService,
    private trailPreviewService: TrailPreviewService,
    private accessibilityService: NotificationService,
    private maintenanceService: MaintenanceService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isTrailSelectedVisible = false;
    this.isTrailListVisible = false;
    this.isAllTrailVisible = true;
    this.isNotificationModalVisible = false;
    this.isTrailFullScreenVisible = false;
    this.isUserPositionToggled = false;
    this.changeTileLayer("topo");
    this.trailPreviewList = [];
    this.trailList = [];
    this.handleQueryParam();
    if(this.isAllTrailVisible){
      this.loadAllTrails();
    }
  }

  private handleQueryParam() {
    const idFromPath: string = this.route.snapshot.paramMap.get("id");
    this.loadTrail(idFromPath);
  }

  ngAfterViewInit(): void {
    let fullSize = GraphicUtils.getFullHeightSizeMenu();
    document.getElementById(MapComponent.TRAIL_LIST_COLUMN_ID).style.minHeight = fullSize.toString() + "px";
    document.getElementById(MapComponent.TRAIL_DETAILS_ID).style.minHeight = fullSize.toString() + "px";
  }

  loadPreviews(): void {
    this.trailPreviewService.getPreviews().subscribe(previewResponse => { this.trailPreviewList = previewResponse.content; console.log(this.trailPreviewList) });
  }

  loadTrail(code: string): void {
    if (code) {
      this.trailService.getTrailByCode(code).subscribe(
        trailResponse => {
          this.selectedTrail = trailResponse.content[0];
          this.selectedTrail.statsMetadata.eta = Math.round(this.selectedTrail.statsMetadata.eta);
          this.selectedTrail.statsMetadata.length = Math.round(this.selectedTrail.statsMetadata.length);
          this.loadNotificationsForTrail(code);
          this.loadLastMaintenaceForTrail(code);
          this.isTrailSelectedVisible = true;
        });
    }
  }

  loadNotificationsForTrail(code: string): void {
    this.accessibilityService.getUnresolvedByTrailByCode(code).subscribe(notificationResponse => { this.trailNotifications = notificationResponse.content });
  }
  
  loadLastMaintenaceForTrail(code: string): void {
    this.maintenanceService.getPastForTrail(code).subscribe(maintenanceResponse => { this.lastMaintenance = maintenanceResponse.content[0] });
  }

  loadAllTrails(): void {
    this.trailService.getTrailsLight().subscribe(trailResponse => { this.trailList = trailResponse.content });
  }

  loadBinaryPath(): void {
    this.trailService.downloadGpx(this.selectedTrail.code).subscribe(response => {
      let blob:any = new Blob([response], { type: 'text/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      FileSaver.saveAs(blob, this.selectedTrail.code + ".gpx");
    });
  }

  onDownloadBinary(): void {
    this.loadBinaryPath();
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

  toggleUserPosition(): void {
    this.isUserPositionToggled = this.isTrailFullScreenVisible ? false : true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userPosition = new UserCoordinates(
          position.coords.latitude,
          position.coords.longitude)
      }, (error) => alert(error))
    }
  }

  navigateToLocation(location: TrailCoordinates) {
    this.highlightedLocation = location;
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
