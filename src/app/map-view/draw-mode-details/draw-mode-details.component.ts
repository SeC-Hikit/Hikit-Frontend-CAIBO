import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomItineraryRequest, CustomItineraryResult} from "../../service/custom-itinerary.service";
import {ChartUtils} from "../ChartUtils";
import * as Chart from "chart.js";
import {ChartOptions} from "chart.js";

@Component({
    selector: 'app-draw-mode-details',
    templateUrl: './draw-mode-details.component.html',
    styleUrls: ['./draw-mode-details.component.scss']
})
export class DrawModeDetailsComponent implements OnInit {


    private chart: Chart;
    private chartOptions: ChartOptions;

    @Input() customItineraryResult: CustomItineraryResult;
    @Input() customRequest: CustomItineraryRequest;
    @Output() onCustomItineraryNewRequest = new EventEmitter<void>();

    isLoading: boolean = false;

    constructor() {

    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.chartOptions = ChartUtils.getChartOptions(
            (number) => this.onHoverAltiGraph(number));
        this.chart = new Chart("hikeCustomChart", {
            type: "line",
            options: this.chartOptions,
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName == "customItineraryResult") {
                this.isLoading = false;
                this.updateChart();
            }
        }
    }

    onCalculateItineraryClick() {
        this.isLoading = true;
        this.onCustomItineraryNewRequest.emit();
    }

    onNotificationClick(id: string) {

    }

    getDistance() {
        let s = this.customItineraryResult.stats.length;
        return Math.round(s);
    }

    private onHoverAltiGraph(number: number) {

    }

    updateChart(): void {
        if(!this.chart) {
            setTimeout(() => this.updateChart(), 200);
            return; }
        ChartUtils.clearChart(this.chart);
        let altitudeDataPoints = this.customItineraryResult.coordinates.map(c => c.altitude);
        this.chart.data.labels = this.customItineraryResult.coordinates.map(c => c.distanceFromTrailStart + "m");
        this.chart.data.datasets = [{
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            pointRadius: 0,
            data: altitudeDataPoints,
            label: "Percorso personalizzato"
        }]
        this.chart.update();
    }
}
