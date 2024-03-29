import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  @Input() title: string = "";
  @Input() body: string = "";

  @Output() onOk: EventEmitter<void> = new EventEmitter<void>();

  constructor(private modalService: NgbActiveModal) {}

  ngOnInit(): void {
  }

  dismiss() {
    this.modalService.close();
  }

  close() {
    this.onOk.emit();
    this.modalService.close();
  }
}
