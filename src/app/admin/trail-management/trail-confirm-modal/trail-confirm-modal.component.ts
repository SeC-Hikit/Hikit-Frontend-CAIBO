import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceRefDto} from "../../../service/place.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PickedPlace} from "../trail-upload-management/place-picker-selector/place-picker-selector.component";
import {Crossing} from "../trail-upload-management/trail-upload-management.component";

@Component({
  selector: 'app-trail-confirm-modal',
  templateUrl: './trail-confirm-modal.component.html',
  styleUrls: ['./trail-confirm-modal.component.scss']
})
export class TrailConfirmModalComponent implements OnInit {

  @Input() trailCode: string;
  @Input() distance: string;
  @Input() maxRadius: string;
  @Input() locationName: string; // partenza/intermedio/fine
  @Input() crossway : Crossing;

  @Output() onOk : EventEmitter<PlaceRefDto> = new EventEmitter<PlaceRefDto>();
  @Output() onRefusal : EventEmitter<void> = new EventEmitter<void>();


  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onConfirm() {
    this.onOk.emit(this.crossway);
    this.activeModal.close();
  }

  onNotConfirm() {
    this.onRefusal.emit();
    this.activeModal.close();
  }
}
