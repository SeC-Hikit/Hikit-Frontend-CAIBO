import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crossing-modal',
  templateUrl: './crossing-modal.component.html',
  styleUrls: ['./crossing-modal.component.scss']
})
export class CrossingModalComponent implements OnInit {

  @Input() location;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
