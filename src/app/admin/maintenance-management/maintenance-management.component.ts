import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Maintenance } from 'src/app/Maintenance';
import { MaintenanceService } from 'src/app/maintenance.service';

@Component({
  selector: 'app-maintenance-management',
  templateUrl: './maintenance-management.component.html',
  styleUrls: ['./maintenance-management.component.css']
})
export class MaintenanceManagementComponent implements OnInit {

  maintenanceListFuture : Maintenance[];
  maintenanceListPast : Maintenance[];

  constructor(private maintenanceService : MaintenanceService) { 
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
  }

  ngOnInit(): void {
    const maintenanceResponseFuture = this.maintenanceService.getFuture().subscribe(x=> { this.maintenanceListFuture = x.maintenanceList; console.log(this.maintenanceListFuture )});
    const maintenanceResponsePast = this.maintenanceService.getPast().subscribe(x=> { this.maintenanceListPast = x.maintenanceList}); 
  }

  onDelete(maintenace : Maintenance) {
    
  } 

  formatDate(dateString: string) : string {
    return moment(dateString).format("DD/MM/YYYY");
  }
}
