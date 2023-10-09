import {Component, OnInit} from '@angular/core';
import {TrailDto, TrailMappingDto, TrailService} from "../../../service/trail-service.service";
import {MaintenanceDto, MaintenanceService} from "../../../service/maintenance.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";
import {AuthService} from "../../../service/auth.service";
import {ActivatedRoute} from "@angular/router";
import {Status} from "../../../Status";
import {DateUtils} from "../../../utils/DateUtils";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";
import {PaginationUtils} from "../../../utils/PaginationUtils";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AnnouncementTopic} from "../../../service/announcement.service";

@Component({
    selector: 'app-maintenance-past-view',
    templateUrl: './maintenance-past-view.component.html',
    styleUrls: ['./maintenance-past-view.component.scss']
})
export class MaintenancePastViewComponent implements OnInit {
    trailMapping: TrailMappingDto[] = [];

    hasFutureLoaded = false;
    isLoaded = false;
    isPreviewVisible = false;

    selectedTrail: TrailDto;

    maintenanceListPast: MaintenanceDto[] = [];
    savedMaintenance: string;
    realm: string;

    entryPerPage = 10;
    page = 1;
    totalEntries = 0;

    constructor(
        private maintenanceService: MaintenanceService,
        private adminMaintenanceService: AdminMaintenanceService,
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private modalService: NgbModal
    ) {
        this.maintenanceListPast = [];
        this.trailMapping = [];
    }

    ngOnInit(): void {
        this.realm = this.authService.getInstanceRealm();
        this.trailPreviewService.getMappings(this.realm)
            .subscribe((resp) => {
                this.trailMapping = resp.content;
                this.onLoadMaintenancePast(1);
            })
    }

    showPreview(trailId) {
        this.trailService.getTrailById(trailId).subscribe(
            trailResp => {
                this.selectedTrail = trailResp.content[0];
                this.togglePreview();
            }
        );
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    onFileSave(saveMaintenanceCode: string) {
        this.savedMaintenance = saveMaintenanceCode;
    }

    onDelete(maintenace: MaintenanceDto) {
        let isDeleting = confirm(
            "Sei sicuro di voler cancellare la manuntenzione con codice '" +
            maintenace.id +
            "' e data '" +
            this.formatDate(maintenace.date.toString()) +
            "'?"
        );
        if (isDeleting) {
            this.adminMaintenanceService.deleteById(maintenace.trailId)
                .subscribe((d) => {
                    if (d.status == Status.OK) this.onDeleted(maintenace);
                });
        }
    }

    getTrailCode(maintenance: MaintenanceDto) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == maintenance.trailId);
        if (filtered.length > 0)
            return filtered[0].code;
        else
            return maintenance.trailCode;
        console.warn(`Could not find trailId or trailCode for maintenance ${maintenance.id}`);
        return "";
    }

    getTrailColor(maintenance: MaintenanceDto) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == maintenance.trailId);
        if (filtered.length > 0)
            return "#000000";
        else
            return "#6B0909";
        console.warn(`Could not find trailId or trailCode for maintenance ${maintenance.id}`);
        return "";
    }

    onDeleted(unresolvedNotification: MaintenanceDto): void {
        this.onLoadMaintenancePast(this.page);
    }

    formatDate(dateString: string): string {
        return DateUtils.formatDateToDay(dateString);
    }

    onLoadMaintenancePast(page: number) {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadMaintenancePast(lowerBound, this.entryPerPage * page, this.authService.getInstanceRealm());
    }

    loadMaintenancePast(skip: number, limit: number, realm: string) {
        this.isLoaded = false;
        this.maintenanceService.getPast(skip, limit, realm)
            .subscribe((resp) => {
                this.maintenanceListPast = resp.content;
                this.totalEntries = resp.totalCount;
                this.isLoaded = true;
            });
    }

    copyId(id: string) {
        PaginationUtils.copyToClipboard(id).then(() => {
            const modal = this.modalService.open(InfoModalComponent);
            modal.componentInstance.title = "ID '" + id + "', copiato";
            if(this.authService.isRealmMatch()) {
                modal.componentInstance.body = PaginationUtils.getOptionsText(id,
                    AnnouncementTopic.MAINTENANCE)
            }
        })
    }
}
