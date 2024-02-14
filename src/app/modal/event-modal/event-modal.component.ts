import {Component, Input, OnInit} from '@angular/core';
import {EventDto} from "../../service/ert.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-event-modal',
    templateUrl: './event-modal.component.html',
    styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {

    @Input() event: EventDto;

    constructor(private modalService: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    close() {
        this.modalService.close();
    }

}
