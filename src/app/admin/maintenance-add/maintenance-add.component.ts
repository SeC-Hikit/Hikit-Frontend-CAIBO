import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Maintenance } from 'src/app/Maintenance';
import { MaintenanceService } from 'src/app/maintenance.service';
import { Status } from 'src/app/Status';
import { TrailPreviewService } from 'src/app/trail-preview-service.service';
import { TrailPreviewResponse } from 'src/app/TrailPreviewResponse';

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html',
  styleUrls: ['./maintenance-add.component.css']
})
export class MaintenanceAddComponent implements OnInit {

  formGroup: FormGroup;

  trailIds: string[];

  constructor(
    private trailPreviewService: TrailPreviewService,
    private maintenanceService: MaintenanceService,
    private router: Router) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'code': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'contact': new FormControl('', Validators.required),
      'meetingPlace': new FormControl(''),
      'date': new FormControl('', Validators.required),
    });
    this.trailPreviewService.getPreviews().subscribe(x => { this.onLoad(x) })
  }

  onLoad(x: TrailPreviewResponse) {
    this.trailIds = x.trailPreviews.map(tp => tp.code);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      let maintenance = this.formGroup.value as Maintenance;
      let formDate = this.formGroup.value.date;
      maintenance.date = moment(formDate.year +
        "-" + formDate.month +
        "-" + formDate.day).toDate();
      this.maintenanceService.save(maintenance).subscribe(resp=>{if(resp.status==Status.OK) { this.onSaveSuccess() }});
    } else {
      alert("Alcuni campi sono ancora da completare")
    }
  }

  onSaveSuccess() {
    this.router.navigate(['/admin/maintenance', { success: true }]);  
  }
}
