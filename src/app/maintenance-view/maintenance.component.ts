import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Maintenance, MaintenanceService as MaintenanceService } from '../maintenance.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {


  maintenanceListFuture : Maintenance[];
  maintenanceListPast : Maintenance[];

  constructor(private maintenanceService : MaintenanceService) { 
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
  }

  ngOnInit(): void {
    const maintenanceResponseFuture = this.maintenanceService.getFuture().subscribe(x=> { this.maintenanceListFuture = x.content; console.log(this.maintenanceListFuture )});
    const maintenanceResponsePast = this.maintenanceService.getPast().subscribe(x=> { this.maintenanceListPast = x.content}); 
  }

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }

}
