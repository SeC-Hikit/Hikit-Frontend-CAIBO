import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartOptions } from 'chart.js';
import { AccessibilityNotificationUnresolved } from 'src/app/AccessibilityNotificationUnresolved';
import { Trail } from 'src/app/Trail';
import { ChartUtils } from '../ChartUtils';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-trail-full',
  templateUrl: './map-trail-full.component.html',
  styleUrls: ['./map-trail-full.component.css']
})
export class MapTrailFullComponent implements OnInit {

  private chart: Chart;
  private chartOptions: ChartOptions;

  @Input() selectedTrail: Trail;
  @Input() trailNotifications: AccessibilityNotificationUnresolved[];

  @Output() isVisibleEvent = new EventEmitter<void>();
  @Output() downloadGpxEvent = new EventEmitter<void>();
  @Output() toggleNotificationModalEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = ChartUtils.getChartOptions();
    this.chart = new Chart("chartHike", {
      type: "line",
      options: this.chartOptions,
    });


  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (!this.selectedTrail) { return; }

    for (const propName in changes) {
      if (propName == "selectedTrail") { this.updateChart() }
    }
  }

  updateChart(): void {
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

  isInitialized() {
    return this.chart;
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
