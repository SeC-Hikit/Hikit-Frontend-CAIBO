import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

export interface Choice {
    name: string;
    value: string;
    imageUrl: string;
}

@Component({
    selector: 'app-option-modal',
    templateUrl: './option-modal.component.html',
    styleUrls: ['./option-modal.component.scss']
})
export class OptionModalComponent implements OnInit {

    content: string = "";

    @Input() title: string = "";
    @Input() body: string = "";

    @Input() selectors: Choice[] = []
    @Input() selected: Choice;
    @Output() onPromptOk: EventEmitter<Choice> = new EventEmitter<Choice>();
    private selectedValue: Choice;


    constructor(private modalService: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    onOk() {
        this.onPromptOk.emit(this.selectedValue);
        this.close();
    }

    close() {
        this.modalService.close();
    }

    onSelectValue(value: Choice) {
        this.selectedValue = value;
        this.selected = value;
    }

}
