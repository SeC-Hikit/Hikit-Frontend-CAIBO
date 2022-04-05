import {Component, OnInit} from '@angular/core';
import {MaintenanceDto, MaintenanceService} from "../../../service/maintenance.service";
import {DateUtils} from "../../../utils/DateUtils";
import {TrailDto, TrailMappingDto, TrailService} from "../../../service/trail-service.service";
import {AuthService} from "../../../service/auth.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";

@Component({
    selector: 'app-maintenance-future-view',
    templateUrl: './maintenance-future-view.component.html',
    styleUrls: ['./maintenance-future-view.component.scss']
})
export class MaintenanceFutureViewComponent implements OnInit {

    isPreviewVisible: boolean = false;
    isLoaded: boolean = false;

    trailMapping: TrailMappingDto[] = [];
    maintenanceListFuture: MaintenanceDto[] = [];

    selectedTrail: TrailDto;
    private realm: string;

    entryPerPage = 10;
    totalEntries = 0;
    page = 1;


    constructor(private trailService: TrailService,
                private adminMaintenanceService: AdminMaintenanceService,
                private maintenanceService: MaintenanceService,
                private trailPreviewService: TrailPreviewService,
                private modalService: NgbModal,
                public authService: AuthService) {
    }

    ngOnInit(): void {
        this.realm = this.authService.getUserRealm();
        this.trailPreviewService.getMappings(this.realm)
            .subscribe((resp) => {
                this.trailMapping = resp.content;
                this.onLoadMaintenance(1);
                this.isLoaded = true;
            })
    }

    onLoadMaintenance(page: number){
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadMaintenanceFuture(
            lowerBound, this.entryPerPage * page,
            this.authService.getUserRealm());
    }

    loadMaintenanceFuture(skip: number, limit: number, realm: string) {
        this.maintenanceService.getFuture(skip, limit, realm)
            .subscribe(
                (resp) => {
                    this.maintenanceListFuture = resp.content;
                    this.totalEntries = resp.totalCount;
                })
    }

    formatDate(dateString: string) {
        return DateUtils.formatDateToDay(dateString);
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    showPreview(trailId) {
        this.trailService.getTrailById(trailId).subscribe(
            trailResp => {
                this.selectedTrail = trailResp.content[0];
                this.togglePreview();
            }
        );
    }

    getTrailCode(trailId: string) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == trailId);
        if (filtered.length > 0) {
            return filtered[0].code;
        }
        console.warn(`Could not find trail mapping for id: ${trailId}`)
        return "";
    }

    onDeleteClick(maintenance: MaintenanceDto) {
        this.isLoaded = false;
        this.adminMaintenanceService.deleteById(maintenance.id).subscribe(
            (resp) => {
                if (resp.status == "OK") {
                    this.onLoadMaintenance(this.page);
                } else {
                    this.openModalToShowErrors(resp.messages);
                }
                this.isLoaded = true;
            })
    }

    private openModalToShowErrors(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel caricamento del sentiero`;
        const matchingTrail = errors.map(it => `<div>${it}</div>`).join("<br/>");
        modal.componentInstance.body = `Errori imprevisti in risposta dal server: ${matchingTrail}`;
    }


}
