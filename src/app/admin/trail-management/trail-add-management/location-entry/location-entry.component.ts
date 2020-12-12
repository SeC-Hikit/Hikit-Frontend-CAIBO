import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrailCoordinates } from 'src/app/TrailCoordinates';

@Component({
  selector: 'app-location-entry',
  templateUrl: './location-entry.component.html',
  styleUrls: ['./location-entry.component.css']
})
export class LocationEntryComponent implements OnInit {


  @Input() i : number; 
  @Input() inputForm : FormGroup; 
  @Input() trailCoordinates: TrailCoordinates[];

  selectedCoordinate: TrailCoordinates;

  constructor() { }
  
  ngOnInit(): void {
  }

  onSliderMoved(eventValue: number): void {
    console.log(eventValue);
    console.log(this.trailCoordinates);
    this.selectedCoordinate = this.trailCoordinates[eventValue];
    this.inputForm.controls['latitude'].setValue(this.selectedCoordinate.latitude);
    this.inputForm.controls['longitude'].setValue(this.selectedCoordinate.longitude);
    this.inputForm.controls['altitutde'].setValue(this.selectedCoordinate.altitude);
    this.inputForm.controls['distanceFromTrailStart'].setValue(this.selectedCoordinate.distanceFromTrailStart);
  }

}
