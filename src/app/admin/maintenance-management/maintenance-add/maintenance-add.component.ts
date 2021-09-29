import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Maintenance, MaintenanceService } from 'src/app/service/maintenance.service';
import { Status } from 'src/app/Status';
import { TrailPreviewResponse, TrailPreviewService } from 'src/app/service/trail-preview-service.service';

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html',
  styleUrls: ['./maintenance-add.component.scss']
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
    // this.trailPreviewService.getPreviews().subscribe(x => { this.onLoad(x) })
  }

  onLoad(x: TrailPreviewResponse) {
    this.trailIds = x.content.map(tp => tp.code);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      let maintenance = this.formGroup.value as Maintenance;
      let formDate = this.formGroup.value.date;
      maintenance.date = moment(formDate.year +
        "-" + formDate.month +
        "-" + formDate.day).toISOString();
      this.maintenanceService.save(maintenance).subscribe(resp=>{if(resp.status==Status.OK) { this.onSaveSuccess(maintenance) }});
    } else {
      alert("Alcuni campi sono ancora da completare")
    }
  }

  onSaveSuccess(maintenance: Maintenance) {
    this.router.navigate(['/admin/maintenance', { success: maintenance.id }]);  
  }
}
