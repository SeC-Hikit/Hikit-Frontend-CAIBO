import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrailCoordinates } from 'src/app/trail-service.service';

@Component({
  selector: 'app-location-entry',
  templateUrl: './location-entry.component.html',
  styleUrls: ['./location-entry.component.scss']
})
export class LocationEntryComponent implements OnInit {


  @Input() i : number; 
  @Input() inputForm : FormGroup; 
  @Input() trailCoordinates: TrailCoordinates[];
  @Input() isEditableLocation: boolean;

  selectedCoordinate: TrailCoordinates;

  constructor() { }
  
  ngOnInit(): void {
  }

  onSliderMoved(eventValue: number): void {
    console.log(this.isEditableLocation);
    this.selectedCoordinate = this.trailCoordinates[eventValue];
    this.inputForm.controls['latitude'].setValue(this.selectedCoordinate.latitude);
    this.inputForm.controls['longitude'].setValue(this.selectedCoordinate.longitude);
    this.inputForm.controls['altitude'].setValue(this.selectedCoordinate.altitude);
    this.inputForm.controls['distanceFromTrailStart'].setValue(this.selectedCoordinate.distanceFromTrailStart);
  }

}
