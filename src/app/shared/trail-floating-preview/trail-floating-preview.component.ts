import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Marker} from "src/app/map-preview/map-preview.component";
import {TrailDto} from "src/app/service/trail-service.service";
import {MunicipalityToTrailDto} from "../../service/admin-trail_preview.service";

@Component({
  selector: "app-trail-floating-preview",
  templateUrl: "./trail-floating-preview.component.html",
  styleUrls: ["./trail-floating-preview.component.scss"],
})
export class TrailFloatingPreviewComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() trails: TrailDto[] = [];
  @Input() municipalities: MunicipalityToTrailDto[] = [];
  @Input() markers: Marker[];
  @Output() onClose = new EventEmitter<void>();

  otherTrails: TrailDto[] = [];

  constructor() {}

  ngOnInit(): void {

  }

}
