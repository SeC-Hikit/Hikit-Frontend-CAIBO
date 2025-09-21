import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Media} from "../../service/media-service.service";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {

  @Input() title: string = "";
  @Input() body: string = "";
  @Input() mediaDtos: Media[] = []

  constructor(private modalService: NgbActiveModal) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.modalService.close();
  }

  close() {
    this.modalService.close();
  }
}
