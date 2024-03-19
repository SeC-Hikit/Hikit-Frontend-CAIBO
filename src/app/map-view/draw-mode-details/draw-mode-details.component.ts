import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomItineraryRequest, CustomItineraryResult} from "../../service/custom-itinerary.service";
import {ChartUtils} from "../ChartUtils";
import * as Chart from "chart.js";
import {ChartOptions} from "chart.js";
import {TrailClassificationUtils} from "../../TrailClassificationUtils";

@Component({
    selector: 'app-draw-mode-details',
    templateUrl: './draw-mode-details.component.html',
    styleUrls: ['./draw-mode-details.component.scss']
})
export class DrawModeDetailsComponent implements OnInit {


    private chart: Chart;
    private chartOptions: ChartOptions;

    calculatedClassification = ""

    @Input() customItineraryResult: CustomItineraryResult;
    @Input() customRequest: CustomItineraryRequest;
    @Input() isLoading: boolean = false;

    @Output() onCustomItineraryNewRequest = new EventEmitter<void>();
    @Output() onCloseItineraryCircle = new EventEmitter<void>();
    @Output() onBackBtn = new EventEmitter<void>();
    @Output() onDeleteItinerary = new EventEmitter<void>();


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
                this.calculatedClassification = this.calculateTrailClassification()
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
        if (!this.chart) {
            setTimeout(() => this.updateChart(), 500);
            return;
        }
        ChartUtils.clearChart(this.chart);

        let coordinates = this.customItineraryResult ? this.customItineraryResult.coordinates : [];

        let altitudeDataPoints = coordinates.map(c => c.altitude);
        this.chart.data.labels = coordinates.map(c => c.distanceFromTrailStart + "m");
        this.chart.data.datasets = [{
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            pointRadius: 0,
            data: altitudeDataPoints,
            label: "Percorso personalizzato"
        }]
        this.chart.update();
    }

    onEncounteredTrailClick(id: string) {

    }

    private calculateTrailClassification() {
        return TrailClassificationUtils.getHighestClassification(
            this.customItineraryResult.trailPreviews.map(it=>
                TrailClassificationUtils.getClassification(it.classification)))
    }
}
