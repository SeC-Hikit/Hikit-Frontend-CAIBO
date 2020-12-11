import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-location-entry',
  templateUrl: './location-entry.component.html',
  styleUrls: ['./location-entry.component.css']
})
export class LocationEntryComponent implements OnInit {


  @Input() inputForm : FormGroup; 
  @Input() i : number; 

  constructor() { }

  ngOnInit(): void {
    
  }

}
