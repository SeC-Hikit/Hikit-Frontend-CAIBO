import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MaintenanceDto, MaintenanceService as MaintenanceService } from '../service/maintenance.service';
import {TrailDto, TrailMappingDto, TrailService} from "../service/trail-service.service";
import {DateUtils} from "../utils/DateUtils";
import {InfoModalComponent} from "../modal/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrailPreviewService} from "../service/trail-preview-service.service";
import {AuthService} from "../service/auth.service";


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {


  isPreviewVisible: boolean = false;
  isLoaded: boolean = false;

  trailMapping: TrailMappingDto[] = [];
  maintenanceListFuture: MaintenanceDto[] = [];
  maintenanceListPast : MaintenanceDto[] = [];

  selectedTrail: TrailDto;
  private realm: string;

  entryPerPage = 10;
  totalFutureEntries = 0;
  totalPastEntries = 0;
  page = 1;


  constructor(private maintenanceService : MaintenanceService,
              private modalService: NgbModal,
              private trailPreviewService: TrailPreviewService,
              private trailService: TrailService,
              private authService: AuthService
  ) {
    this.maintenanceListFuture = [];
    this.maintenanceListPast = [];
  }

  ngOnInit(): void {
    this.realm = this.authService.getInstanceRealm();
    this.trailPreviewService.getMappings(this.realm)
        .subscribe((resp) => {
          this.trailMapping = resp.content;
          this.loadMaintenanceFuture(0, 10);
          this.loadMaintenancePast(0, 10);
          this.isLoaded = true;
        })
  }

  loadMaintenanceFuture(skip: number, limit: number) {
    this.maintenanceService.getFuture(skip, limit)
        .subscribe(
            (resp) => {
              this.maintenanceListFuture = resp.content;
              this.totalFutureEntries = resp.totalCount;
            })
  }

  loadMaintenancePast(skip: number, limit: number) {
    this.maintenanceService.getPast(skip, limit)
        .subscribe(
            (resp) => {
              this.maintenanceListPast = resp.content;
              this.totalPastEntries = resp.totalCount;
            })
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  showPreview(trailId) {
    if(!trailId)
    {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Il sentiero non è ancora collegato ad alcuno da sistema`;
        modal.componentInstance.body = `Il sentiero su cui è svolta la manutenzione non è ancora accatastato.`;
        return;
    }
    this.trailService.getTrailById(trailId).subscribe(
        trailResp => {
          this.selectedTrail = trailResp.content[0];
          this.togglePreview();
        }
    );
  }

    getTrailCode(trailId: string, trailCode: string) {
      if(!trailId) {
          return trailCode;
      }
    const filtered = this.trailMapping
        .filter((tp) => tp.id == trailId);
    if (filtered.length > 0) {
      return filtered[0].code;
    }
    console.warn(`Could not find trail mapping for id: ${trailId}`)
    return "";
  }

  private openModalToShowErrors(errors: string[]) {
    const modal = this.modalService.open(InfoModalComponent);
    modal.componentInstance.title = `Errore nel caricamento del sentiero`;
    const matchingTrail = errors.map(it => `<div>${it}</div>`).join("<br/>");
    modal.componentInstance.body = `Errori imprevisti in risposta dal server: ${matchingTrail}`;
  }

}
