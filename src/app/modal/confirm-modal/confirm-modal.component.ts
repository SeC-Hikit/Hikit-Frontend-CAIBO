import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Input() title: string = "";
  @Input() body: string = "";

  constructor(private modalService: NgbActiveModal) {}

  ngOnInit(): void {
  }

  onOk(){

  }

  onCancel() {

  }

  dismiss() {
    this.modalService.close();
  }

  close() {
    this.modalService.close();
  }

}
