import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-prompt-modal',
    templateUrl: './prompt-modal.component.html',
    styleUrls: ['./prompt-modal.component.scss']
})
export class PromptModalComponent implements OnInit {

    content: string = "";

    @Input() title: string = "";
    @Input() body: string = "";

    @Output() onPromptOk: EventEmitter<string> = new EventEmitter<string>();
    @Output() onPromptCancel: EventEmitter<void> = new EventEmitter<void>();

    constructor(private modalService: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    onOk() {
        this.onPromptOk.emit(this.content);
        this.close();
    }

    onCancel() {
        this.onPromptCancel.emit();
        this.close();
    }

    close() {
        this.modalService.close();
    }

    onChange($event: any) {
        this.content = $event.target.value;
    }
}
