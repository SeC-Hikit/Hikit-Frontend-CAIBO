import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-selection-modal',
  templateUrl: './selection-modal.component.html',
  styleUrls: ['./selection-modal.component.scss']
})
export class SelectionModalComponent implements OnInit {

  @Input() title: string = "";
  @Input() body: string = "";

  constructor(private modalService: NgbActiveModal) {}

  ngOnInit(): void {
  }

  dismiss() {
    this.modalService.close();
  }
}
