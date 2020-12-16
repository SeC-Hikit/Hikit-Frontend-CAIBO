import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Maintenance } from 'src/app/Maintenance';
import { MaintenanceService } from 'src/app/maintenance.service';
import { Status } from 'src/app/Status';

@Component({
  selector: 'app-maintenance-management',
  templateUrl: './maintenance-management.component.html',
  styleUrls: ['./maintenance-management.component.css']
})
export class MaintenanceManagementComponent implements OnInit {

  maintenanceListFuture: Maintenance[];
  maintenanceListPast: Maintenance[];
  savedMaintenance: string;

  constructor(
    private maintenanceService: MaintenanceService,
    private route: ActivatedRoute) {
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
  }

  ngOnInit(): void {
    const maintenanceResponseFuture = this.maintenanceService.getFuture().subscribe(x => { this.maintenanceListFuture = x.maintenanceList; console.log(this.maintenanceListFuture) });
    const maintenanceResponsePast = this.maintenanceService.getPast().subscribe(x => { this.maintenanceListPast = x.maintenanceList });
    let codeTrailSaved = this.route.snapshot.paramMap.get("success") as string;
    if (codeTrailSaved) { this.onFileSave(codeTrailSaved); }
  }

  onFileSave(saveMaintenanceCode : string) {
    this.savedMaintenance = saveMaintenanceCode;
  }

  onDelete(maintenace: Maintenance) {
    let isDeleting = confirm("Sei sicuro di voler cancellare la manuntenzione con codice '" + maintenace.code + "' e data '" + this.formatDate(maintenace.date.toString()) + "'?");
    if (isDeleting) {
      this.maintenanceService.deleteById(maintenace._id).subscribe(d => { if (d.status == Status.OK) this.onDeleted(maintenace); });
    }

  }

  onDeleted(unresolvedNotification: Maintenance): void {
    let i = this.maintenanceListFuture.indexOf(unresolvedNotification);
    this.maintenanceListFuture.splice(i, 1);
  }


  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY");
  }
}
