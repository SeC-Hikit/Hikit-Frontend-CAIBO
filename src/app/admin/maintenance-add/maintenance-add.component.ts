import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html',
  styleUrls: ['./maintenance-add.component.css']
})
export class MaintenanceAddComponent implements OnInit {

  formGroup : FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({});
  }

}
