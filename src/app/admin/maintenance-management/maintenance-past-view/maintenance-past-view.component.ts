import {Component, OnInit} from '@angular/core';
import {TrailDto, TrailMappingDto, TrailService} from "../../../service/trail-service.service";
import {MaintenanceDto, MaintenanceService} from "../../../service/maintenance.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";
import {AuthService} from "../../../service/auth.service";
import {ActivatedRoute} from "@angular/router";
import {Status} from "../../../Status";
import {DateUtils} from "../../../utils/DateUtils";
import {AdminMaintenanceService} from "../../../service/admin-maintenance.service";

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
        private route: ActivatedRoute
    ) {
        this.maintenanceListPast = [];
        this.trailMapping = [];
    }

    ngOnInit(): void {
        this.realm = this.authService.getRealm();
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

    getTrailCode(trailId: string) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == trailId);
        if (filtered.length > 0) {
            return filtered[0].code;
        }
        console.warn(`Could not find trail mapping for id: ${trailId}`)
        return "";
    }

    onDeleted(unresolvedNotification: MaintenanceDto): void {
    }

    formatDate(dateString: string): string {
        return DateUtils.formatDateToDay(dateString);
    }

    onLoadMaintenancePast(page: number) {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadMaintenancePast(lowerBound, this.entryPerPage * page, this.authService.getRealm());
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
}
