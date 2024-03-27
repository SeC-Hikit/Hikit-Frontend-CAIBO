import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomItineraryRequest, CustomItineraryResult} from "../../../service/custom-itinerary.service";

@Component({
    selector: 'app-draw-mode-preview',
    templateUrl: './draw-mode-preview.component.html',
    styleUrls: ['./draw-mode-preview.component.scss']
})
export class DrawModePreviewComponent implements OnInit {

    @Input() isCustomItineraryPrecise: boolean;
    @Input() customItineraryResult: CustomItineraryResult;
    @Input() customRequest: CustomItineraryRequest;
    @Input() isLoading: boolean = false;

    @Output() onCustomItineraryNewRequest = new EventEmitter<void>();
    @Output() onCloseItineraryCircle = new EventEmitter<void>();
    @Output() onBackBtn = new EventEmitter<void>();
    @Output() onDeleteItinerary = new EventEmitter<void>();
    @Output() onSaveItinerary = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }

    onCalculateCustomItinerary() {
        this.onCustomItineraryNewRequest.emit();
    }

    onCancelItinerary() {
        this.onDeleteItinerary.emit();
    }
}
