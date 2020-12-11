import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-accessibility-add',
  templateUrl: './accessibility-add.component.html',
  styleUrls: ['./accessibility-add.component.css']
})
export class AccessibilityAddComponent implements OnInit {

  formGroup : FormGroup;
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
