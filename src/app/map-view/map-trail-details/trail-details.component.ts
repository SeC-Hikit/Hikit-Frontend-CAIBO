import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {MaintenanceDto} from 'src/app/service/maintenance.service';
import {AccessibilityNotification} from 'src/app/service/notification-service.service';
import {TrailCoordinatesDto, TrailDto} from 'src/app/service/trail-service.service';
import {ChartUtils} from "../ChartUtils";
import * as Chart from "chart.js";
import {ChartOptions} from "chart.js";
import {TrailCycloClassificationMapper} from "../TrailCycloClassificationMapper";
import {Coordinates2D} from "../../service/geo-trail-service";
import {PoiDto} from "../../service/poi-service.service";

@Component({
  selector: 'app-map-trail-details',
  templateUrl: './trail-details.component.html',
  styleUrls: ['./trail-details.component.scss']
})
export class TrailDetailsComponent implements OnInit {

  private chart: Chart;
  private chartOptions: ChartOptions;

  private showIntermediateLocations: boolean = false;

  @Input() selectedTrail: TrailDto;
  @Input() selectedTrailPois: PoiDto[];
  @Input() trailNotifications: AccessibilityNotification[];
  @Input() connectedTrails: TrailDto[];
  @Input() selectedTrailMaintenances: MaintenanceDto[];
  @Input() isCycloSwitchOn: boolean;
  @Input() isPoiLoaded: boolean;

  @Output() toggleFullTrailPageEvent = new EventEmitter<void>();
  @Output() toggleNotificationListEvent = new EventEmitter<void>();
  @Output() onDownloadGpx = new EventEmitter<void>();
  @Output() onDownloadKml = new EventEmitter<void>();
  @Output() onDownloadPdf = new EventEmitter<void>();
  @Output() onNavigateToLocation = new EventEmitter<Coordinates2D>();
  @Output() onNavigateToSelectedTrailCoordIndex = new EventEmitter<number>();
  @Output() onNavigateToTrailReportIssue = new EventEmitter<string>();
  @Output() onSelectTrail = new EventEmitter<string>();
  @Output() onSelectedNotification = new EventEmitter<string>();
  @Output() onMaintenanceClick = new EventEmitter<string>();
  @Output() onToggleModeClick = new EventEmitter<void>();
  @Output() onPoiClickEvent = new EventEmitter<PoiDto>();

  @Output() onPoiHoveringEvent = new EventEmitter<PoiDto>();



  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.chartOptions = ChartUtils.getChartOptions(
        (number) => this.onHoverAltiGraph(number));
    this.chart = new Chart("hikeChart", {
      type: "line",
      options: this.chartOptions,
    });
  }

  onHoverAltiGraph(index: number) {
    this.onNavigateToSelectedTrailCoordIndex.emit(index);
  }

  onHoverAltiGraphOut() {
    this.onNavigateToSelectedTrailCoordIndex.emit(0);
  }

  onPoiClick(poiDto : PoiDto) {
    this.onPoiClickEvent.emit(poiDto);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedTrail) { return; }
    for (const propName in changes) {
      if (propName == "selectedTrail") { this.updateChart() }
    }
  }

  updateChart(): void {
    if(!this.chart) {
      setTimeout(() => this.updateChart(), 0);
      return; }
    ChartUtils.clearChart(this.chart);
    let altitudeDataPoints = this.selectedTrail.coordinates.map(c => c.altitude);
    this.chart.data.labels = this.selectedTrail.coordinates.map(c => c.distanceFromTrailStart + "m");
    this.chart.data.datasets = [{
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      pointRadius: 0,
      data: altitudeDataPoints,
      label: "Sentiero " + this.selectedTrail.code,
    }]
    this.chart.update();
  }

  toggleFullTrailPage(): void {
    this.toggleFullTrailPageEvent.emit();
  }

  toggleEventNotificationList(): void {
    this.toggleNotificationListEvent.emit();
  }

  onDownloadGpxClick() : void {
    this.onDownloadGpx.emit();
  }

  onDownloadKmlClick() : void {
    this.onDownloadKml.emit();
  }

  onDownloadPdfClick() {
    this.onDownloadPdf.emit();
  }

  moveTo(location: TrailCoordinatesDto) {
    console.log(location);
    this.onNavigateToLocation.emit(location);
  }

  getDistance() {
    let s = this.selectedTrail.statsTrailMetadata.length;
    return Math.round(s);
  }

  getMinutes() {
    let s = this.selectedTrail.statsTrailMetadata.eta;
    return Math.round(s);
  }

  getMappedCycloClassification(value: string) {
    return TrailCycloClassificationMapper.map(value);
  }

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  onReportIssueToTrailClick() {
    this.onNavigateToTrailReportIssue.emit(this.selectedTrail.id);
  }

  onRelatedTrailClick(id: string) {
    this.onSelectTrail.emit(id);
  }

  onNotificationClick(notificationId: string) {
    const accessibilityNotification = this.trailNotifications.filter(it => it.id == notificationId)[0];
    this.onNavigateToLocation.emit(
        {
          longitude: accessibilityNotification.coordinates.longitude,
          latitude: accessibilityNotification.coordinates.latitude
        });
    this.onSelectedNotification.emit(notificationId);
  }

  onLastMaintenanceWordClick() {
    this.onMaintenanceClick.emit(this.selectedTrailMaintenances[0].id);
  }

  onToggleMode() {
    this.onToggleModeClick.emit();
  }

  onPoiHover(trailPoi: PoiDto) {
    this.onPoiHoveringEvent.emit(trailPoi);
  }
}
