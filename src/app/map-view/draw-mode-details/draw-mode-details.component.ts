import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomItineraryResult} from "../../service/custom-itinerary.service";

@Component({
    selector: 'app-draw-mode-details',
    templateUrl: './draw-mode-details.component.html',
    styleUrls: ['./draw-mode-details.component.scss']
})
export class DrawModeDetailsComponent implements OnInit {

    @Input() customItinerary: CustomItineraryResult;

    @Output() onCustomItineraryNewRequest = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onCalculateItineraryClick() {
        this.onCustomItineraryNewRequest.emit();
    }

    onNotificationClick(id: string) {

    }

    getDistance() {
        let s = this.customItinerary.stats.length;
        return Math.round(s);
    }

}
