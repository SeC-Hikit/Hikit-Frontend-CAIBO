import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Trail, TrailCoordinates } from "src/app/service/trail-service.service";

@Component({
  selector: "app-trail-floating-preview",
  templateUrl: "./trail-floating-preview.component.html",
  styleUrls: ["./trail-floating-preview.component.scss"],
})
export class TrailFloatingPreviewComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() trailPreview: TrailCoordinates[];
  @Output() onClose = new EventEmitter<void>();;

  constructor() {}

  ngOnInit(): void {}

}
