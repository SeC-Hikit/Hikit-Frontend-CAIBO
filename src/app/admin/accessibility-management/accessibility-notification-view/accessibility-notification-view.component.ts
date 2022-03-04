import {Component, OnInit} from "@angular/core";
import * as moment from "moment";
import {Subject} from "rxjs";
import {
    AccessibilityNotification,
    NotificationService,
} from "src/app/service/notification-service.service";
import {
    TrailPreview,
    TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import {TrailDto, TrailMappingDto, TrailService} from "src/app/service/trail-service.service";
import {Status} from "src/app/Status";
import {AuthService} from "../../../service/auth.service";
import {AdminNotificationService} from "../../../service/admin-notification-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";
import {PromptModalComponent} from "../../../modal/prompt-modal/prompt-modal.component";

@Component({
    selector: "app-accessibility-notification-view",
    templateUrl: "./accessibility-notification-view.component.html",
    styleUrls: ["./accessibility-notification-view.component.scss"],
})
export class AccessibilityNotificationViewComponent implements OnInit {
    entryPerPage = 10;
    page = 1;
    isLoading = false;
    totalNotification: number;

    private destroy$ = new Subject();

    isPreviewVisible: boolean = false;
    hasLoaded = false;

    trailMapping: TrailMappingDto[] = [];
    selectedTrail: TrailDto;
    unresolvedNotifications: AccessibilityNotification[];
    solvedNotifications: AccessibilityNotification[];
    notificationSaved: string;

    constructor(
        private notificationService: NotificationService,
        private adminNotificationService: AdminNotificationService,
        private trailPreviewService: TrailPreviewService,
        private trailService: TrailService,
        private modalService: NgbModal,
        private authService: AuthService,
    ) {
        this.unresolvedNotifications = [];
        this.solvedNotifications = [];
    }

    ngOnInit(): void {
        let realm = this.authService.getRealm();
        this.trailPreviewService.getMappings(realm)
            .subscribe((resp) => {
                this.trailMapping = resp.content;
                this.loadNotification(1);
            })
    }

    onFileSave(notification: string) {
        this.notificationSaved = notification;
    }

    loadNotification(page: number) {
        this.page = page;
        const lowerBound = this.entryPerPage * (page - 1);
        this.loadSolved(lowerBound, this.entryPerPage * page);
    }

    private loadSolved(skip: number, limit: number) {
        this.notificationService.getUnresolved(skip, limit).subscribe(
            (resp) => {
                this.unresolvedNotifications = resp.content;
                this.unresolvedNotifications.forEach((ur) => {
                    this.trailPreviewService
                        .getPreview(ur.trailId)
                        .subscribe((p) => this.trailMapping.push(p.content[0]));
                });

                this.totalNotification = resp.totalPages;
                this.hasLoaded = true;
            });
    }

    formatDate(dateString: string): string {
        return moment(dateString).format("DD/MM/YYYY");
    }

    onDeleteClick(unresolvedNotification: AccessibilityNotification) {
        let isDeleting = confirm(
            "Sei sicuro di voler cancellare la segnalazione in data " +
            this.formatDate(unresolvedNotification.reportDate.toString()) +
            ", per il sentiero '" +
            unresolvedNotification.trailId +
            "'?"
        );
        if (isDeleting) {
            this.adminNotificationService
                .deleteById(unresolvedNotification.id)
                .subscribe((d) => {
                    if (d.status == Status.OK) this.onDeleted(unresolvedNotification);
                });
        }
    }

    onDeleted(unresolvedNotification: AccessibilityNotification): void {
        let i = this.unresolvedNotifications.indexOf(unresolvedNotification);
        this.unresolvedNotifications.splice(i, 1);
    }

    onResolveClick(unresolvedNotification: AccessibilityNotification) {
        const modal = this.modalService.open(PromptModalComponent);
        modal.componentInstance.title = `Risolvi notifica il per sentiero ${this.getTrailCode(unresolvedNotification.trailId)}`;
        modal.componentInstance.body = `Inserisci un messaggio risolutivo della notifica`;
        modal.componentInstance.onPromptOk.subscribe((value: string)=>  {
            alert("message: " + value);
        });
        modal.componentInstance.onPromptCancel.subscribe(()=>{
           alert("nothing");
        })

    }

    onResolve(unresolvedNotification: AccessibilityNotification) {
        let resDesc = "Scrivi una breve risoluzione per la segnalazione " +
            unresolvedNotification.id +
            " riportata in data '" +
            this.formatDate(unresolvedNotification.reportDate.toString()) +
            "' con descrizione: '" +
            unresolvedNotification.description +
            "'";
        let resolution = prompt(resDesc);

        if (resolution != null && resolution.length > 0) {
            let resolutionDate = new Date();
            this.adminNotificationService
                .resolveNotification({
                    id: unresolvedNotification.id,
                    resolution: resolution,
                    resolutionDate: resolutionDate.toDateString(),
                })
                .subscribe((response) => {
                    if (response.status == Status.OK) {
                        this.onResolvedSuccess(
                            unresolvedNotification,
                            resolution,
                            resolutionDate
                        );
                    }
                });
        }
    }

    getTrailCode(trailId) {
        const filtered = this.trailMapping
            .filter((tp) => tp.id == trailId);
        if (filtered.length > 0) {
            return filtered[0].code;
        }
        return "";
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

    onResolvedSuccess(
        resolvedNotification: AccessibilityNotification,
        resolution: string,
        resolutionDate: Date
    ): void {
        this.onDeleted(resolvedNotification);
        this.solvedNotifications.push(resolvedNotification);
    }
}
