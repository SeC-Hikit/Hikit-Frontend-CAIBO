import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MaintenanceDto, MaintenanceService as MaintenanceService } from '../service/maintenance.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  realm : string;

  maintenanceListFuture : MaintenanceDto[];
  maintenanceListPast : MaintenanceDto[];

  constructor(private maintenanceService : MaintenanceService) { 
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
  }

  ngOnInit(): void {
    const maintenanceResponseFuture = this.maintenanceService.getFuture(0, 1).subscribe(x=> { this.maintenanceListFuture = x.content; console.log(this.maintenanceListFuture )});
    const maintenanceResponsePast = this.maintenanceService.getPast(0, 1).subscribe(x=> { this.maintenanceListPast = x.content});
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }

}
