import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { MaintenanceDto } from 'src/app/service/maintenance.service';
import { AccessibilityNotification } from 'src/app/service/notification-service.service';
import { TrailDto, TrailCoordinatesDto } from 'src/app/service/trail-service.service';
import {ChartUtils} from "../ChartUtils";
import * as Chart from "chart.js";
import {ChartOptions} from "chart.js";

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
  @Input() trailNotifications: AccessibilityNotification[];
  @Input() lastMaintenance: MaintenanceDto;
  @Input() isCycloSwitchOn: boolean;

  @Output() toggleFullTrailPageEvent = new EventEmitter<void>();
  @Output() toggleNotificationListEvent = new EventEmitter<void>();
  @Output() onDownloadGpx = new EventEmitter<void>();
  @Output() onDownloadKml = new EventEmitter<void>();
  @Output() onDownloadPdf = new EventEmitter<void>();
  @Output() onNavigateToLocation = new EventEmitter<TrailCoordinatesDto>();
  @Output() onNavigateToSelectedTrailCoordIndex = new EventEmitter<number>();
  @Output() onNavigateToTrailReportIssue = new EventEmitter<string>();



  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.chartOptions = ChartUtils.getChartOptions(
        (number)=> this.onHoverAltiGraph(number));
    this.chart = new Chart("hikeChart", {
      type: "line",
      options: this.chartOptions,
    });
  }

  onHoverAltiGraph(index: number) : void {
    this.onNavigateToSelectedTrailCoordIndex.emit(index);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.selectedTrail) { return; }
    for (const propName in changes) {
      if (propName == "selectedTrail") { this.updateChart() }
    }
  }

  updateChart(): void {
    if(!this.chart) {
      setTimeout(()=> this.updateChart(), 150);
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

  getMinutes(){
    let s = this.selectedTrail.statsTrailMetadata.eta;
    return Math.round(s);
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }

  onReportIssueToTrailClick() {
    this.onNavigateToTrailReportIssue.emit(this.selectedTrail.id);
  }
}
