import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import {
  Maintenance,
  MaintenanceService,
} from "src/app/service/maintenance.service";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { TrailDto, TrailService } from "src/app/service/trail-service.service";
import { Status } from "src/app/Status";

@Component({
  selector: "app-maintenance-management",
  templateUrl: "./maintenance-management.component.html",
  styleUrls: ["./maintenance-management.component.scss"],
})
export class MaintenanceManagementComponent implements OnInit {
  
  cachedTrail: TrailPreview[] = [];
  
  hasFutureLoaded = false;
  hasPastLoaded = false;
  isPreviewVisible = false;

  selectedTrail : TrailDto;

  maintenanceListFuture: Maintenance[];
  maintenanceListPast: Maintenance[];
  savedMaintenance: string;

  constructor(
    private maintenanceService: MaintenanceService,
    private trailPreviewService: TrailPreviewService,
    private trailService: TrailService,
    private route: ActivatedRoute
  ) {
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
    this.cachedTrail = [];
  }

  ngOnInit(): void {
    const maintenanceResponseFuture = this.maintenanceService
      .getFuture()
      .subscribe((x) => {
        this.maintenanceListFuture = x.content;
        let trailIds: string[] = this.maintenanceListFuture.map(
          (m) => m.trailId
        );
        trailIds.forEach((id) =>
          this.trailPreviewService
            .getPreview(id)
            .subscribe((r) =>
              r.content.forEach((t) => this.cachedTrail.push(t))
            )
        );
        this.hasFutureLoaded = true;
      });
    const maintenanceResponsePast = this.maintenanceService
      .getPast()
      .subscribe((x) => {
        this.maintenanceListPast = x.content;
        let trailIds: string[] = this.maintenanceListPast.map(
          (m) => m.trailId
        );
        trailIds.forEach((id) =>
          this.trailPreviewService
            .getPreview(id)
            .subscribe((r) =>
              r.content.forEach((t) => this.cachedTrail.push(t))
            )
        );
        this.hasPastLoaded = true;
      });
    let codeTrailSaved = this.route.snapshot.paramMap.get("success") as string;
    if (codeTrailSaved) {
      this.onFileSave(codeTrailSaved);
    }
  }

  showPreview(trailId) {
    this.trailService.getTrailById(trailId).subscribe(
      trailResp => {
        this.selectedTrail = trailResp.content[0]; 
        this.togglePreview();
      }
    );
  }

  togglePreview(){
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  onFileSave(saveMaintenanceCode: string) {
    this.savedMaintenance = saveMaintenanceCode;
  }

  onDelete(maintenace: Maintenance) {
    let isDeleting = confirm(
      "Sei sicuro di voler cancellare la manuntenzione con codice '" +
        maintenace.id +
        "' e data '" +
        this.formatDate(maintenace.date.toString()) +
        "'?"
    );
    if (isDeleting) {
      this.maintenanceService.deleteById(maintenace.trailId).subscribe((d) => {
        if (d.status == Status.OK) this.onDeleted(maintenace);
      });
    }
  }

  getTrailCode(id: string): string {
    console.log(this.cachedTrail.filter((ct) => ct.id == id));
    if (this.cachedTrail.length == 0) return "";
    let filtered = this.cachedTrail.filter((ct) => ct.id == id)
    return filtered.length > 0 ? filtered[0].code : "";
  }

  onDeleted(unresolvedNotification: Maintenance): void {
    let i = this.maintenanceListFuture.indexOf(unresolvedNotification);
    this.maintenanceListFuture.splice(i, 1);
  }

  formatDate(dateString: string): string {
    return moment(dateString).format("DD/MM/YYYY hh:mm");
  }
}
