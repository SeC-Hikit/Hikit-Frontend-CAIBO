import {Component, OnInit} from '@angular/core';
import {MaintenanceDto} from "../../../service/maintenance.service";
import {DateUtils} from "../../../utils/DateUtils";
import {TrailDto, TrailMappingDto, TrailService} from "../../../service/trail-service.service";
import {AuthService} from "../../../service/auth.service";
import {TrailPreviewService} from "../../../service/trail-preview-service.service";

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
                private authService: AuthService,
                private trailPreviewService: TrailPreviewService) {
    }

    ngOnInit(): void {
        this.realm = this.authService.getRealm();
        this.trailPreviewService.getMappings(this.realm)
            .subscribe((resp) => {
                this.trailMapping = resp.content;
                this.loadMaintenanceFuture(1);
            })
    }

    loadMaintenanceFuture(number: number) {

    }

    formatDate(dateString: string) {
        return DateUtils.formatDateToIta(dateString);
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
}
