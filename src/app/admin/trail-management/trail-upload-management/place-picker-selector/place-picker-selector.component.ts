import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlaceDto} from "../../../../service/place.service";

@Component({
  selector: 'app-place-picker-selector',
  templateUrl: './place-picker-selector.component.html',
  styleUrls: ['./place-picker-selector.component.scss']
})
export class PlacePickerSelectorComponent implements OnInit {

  @Input() places: PlaceDto[];
  @Output() onSelection: EventEmitter<PlaceDto>;
  @Output() onCancel: EventEmitter<void>;

  constructor() { }

  ngOnInit(): void {
  }

  onCancelEvent() : void {
    this.onCancel.emit();
  }

  onSelect(place: PlaceDto) {
      // todo show preview
  }

}
