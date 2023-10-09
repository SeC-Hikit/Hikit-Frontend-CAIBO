import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Input() title: string = "";
  @Input() body: string = "";

  @Input() okBtn: string = "Ok";
  @Input() cancelBtn: string = "Cancella";

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOk: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalService: NgbActiveModal) {}

  ngOnInit(): void {
  }

  onOkClick(){
    this.onOk.emit();
    this.close();
  }

  onCancelClick() {
    this.onCancel.emit();
    this.dismiss();
  }

  dismiss() {
    this.modalService.close();
  }

  close() {
    this.modalService.close();
  }

}
