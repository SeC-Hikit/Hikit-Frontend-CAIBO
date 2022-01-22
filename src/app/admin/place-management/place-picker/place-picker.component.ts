import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Coordinates2D} from "../../../service/geo-trail-service";

@Component({
  selector: 'app-place-picker',
  templateUrl: './place-picker.component.html',
  styleUrls: ['./place-picker.component.scss']
})
export class PlacePickerComponent implements OnInit {

  @Output() onPlaceSelect = new EventEmitter();
  @Input() coordinate : Coordinates2D;

  constructor() { }

  ngOnInit(): void {
  }

}
