import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {
    AccessibilityNotification,
    NotificationService
} from 'src/app/service/notification-service.service';
import {TrailPreviewService} from 'src/app/service/trail-preview-service.service';
import {TrailDto, TrailMappingDto, TrailService} from 'src/app/service/trail-service.service';
import {Coordinates2D} from "../../../service/geo-trail-service";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {Marker} from "../../../map-preview/map-preview.component";
import {GeoToolsService} from "../../../service/geotools.service";
import {AuthService} from "../../../service/auth.service";
import {environment} from "../../../../environments/environment.prod";
import {AdminNotificationService} from "../../../service/admin-notification-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../../modal/info-modal/info-modal.component";

@Component({
    selector: 'app-accessibility-add',
    templateUrl: './accessibility-add.component.html',
    styleUrls: ['./accessibility-add.component.scss']
})
export class AccessibilityAddComponent implements OnInit {

    formGroup: FormGroup = new FormGroup({
        id: new FormControl(""),
        trailId: new FormControl("", Validators.required),
        reportDate: new FormControl("", Validators.required),
        isMinor: new FormControl(true, Validators.required),
        description: new FormControl("", Validators.required),
        coordLongitude: new FormControl("", Validators.required),
        coordLatitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required)
    });

    markers: Marker[] = [];
    trailMappings: TrailMappingDto[];
    selectedTrails: TrailDto[] = [];
    hasFormBeenInitialized: boolean = false;

    validationErrors: string[] = [];

    constructor(
        private trailPreviewService: TrailPreviewService,
        private adminNotificationService: AdminNotificationService,
        private notificationService: NotificationService,
        private trailService: TrailService,
        private geoToolService: GeoToolsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit(): void {
        const idFromPath: string = this.activatedRoute.snapshot.paramMap.get("id");
        if (this.isNotificationLoad(idFromPath)) {
            this.load(idFromPath);
        }

        const realm = this.authService.getInstanceRealm();
        this.trailPreviewService.getMappings(realm)
            .subscribe(resp => {
                this.trailMappings = resp.content;
                this.hasFormBeenInitialized = true;
                if(!this.isNotificationLoad(idFromPath)) {
                    const firstValueInMappings = resp.content[0].id;
                    this.formGroup.get("trailId").setValue(firstValueInMappings);
                    this.loadTrail(firstValueInMappings);
                }
            })
    }

    private isNotificationLoad(idFromPath: string) {
        return idFromPath != null && idFromPath.length > 0;
    }

    onSelectedTrail($event: any): void {
        const id = $event.target.value;
        this.loadTrail(id);
    }

    private loadTrail(id) {
        this.trailService.getTrailById(id).subscribe(resp =>
            this.selectedTrails = [...resp.content]
        );
    }

    onSaveNotification() {
        this.validationErrors = [];
        if (this.formGroup.valid) {
            const objValue = this.formGroup.value;
            let reportedDate = objValue.reportDate;
            let id = this.formGroup.get("id").value;
            let trailId = this.formGroup.get("trailId").value;
            let isMinor = this.formGroup.get("isMinor").value;
            let date = moment(reportedDate.year +
                "-" + reportedDate.month +
                "-" + reportedDate.day).toDate()

            this.authService.getUsername().then((name) => {
                const not: AccessibilityNotification = {
                    id: !id ? null : id,
                    reportDate: date.toISOString(),
                    trailId: trailId,
                    coordinates: {
                        altitude: this.formGroup.get("coordAltitude").value,
                        latitude: this.formGroup.get("coordLatitude").value,
                        longitude: this.formGroup.get("coordLongitude").value,
                    },
                    description: this.formGroup.get("description").value,
                    minor: isMinor,
                    resolution: "",
                    resolutionDate: date.toISOString(),
                    recordDetails: {
                        uploadedOn: moment().toDate().toISOString(),
                        uploadedBy: name,
                        realm: this.authService.getUserRealm(),
                        onInstance: environment.instance
                    }
                };

                this.adminNotificationService.createNotification(not)
                    .subscribe((resp) => {
                        if (resp.status == "OK") {
                            this.router.navigate(["/admin/accessibility-management"]);
                        } else {
                            this.noticeErrorModal(resp.messages);
                        }
                    });

            });
        } else {
            this.validationErrors = ["Il form contiene alcuni errori."];
        }
    }

    onSaveSuccess(notification: AccessibilityNotification): void {
        this.router.navigate(['/admin/accessibility', {success: notification.id}]);
    }

    onMapClick(coords: Coordinates2D) {
        this.drawMarker(coords);
        this.geoToolService.getAltitude(coords).subscribe((resp) => {
            this.formGroup.get("coordLongitude").setValue(resp.longitude);
            this.formGroup.get("coordLatitude").setValue(resp.latitude);
            this.formGroup.get("coordAltitude").setValue(resp.altitude);
        })
    }

    private drawMarker(coords: Coordinates2D) {
        this.markers = [{
            icon: MapPinIconType.ALERT_PIN,
            coords: coords,
            color: "#1D9566"
        }];
    }

    private noticeErrorModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio della notifica`;
        const errorsString = errors.join("<br>")
        modal.componentInstance.body = `<ul>I seguenti errori imepdiscono il salvataggio: <br/>${errorsString}</ul>`;
    }

    private load(idFromPath: string) {
        this.notificationService
            .getById(idFromPath)
            .subscribe((resp) => {
                let loaded = resp.content[0];
                this.formGroup.get("id").setValue(loaded.id);
                this.formGroup.get("trailId").setValue(loaded.trailId);
                this.formGroup.get("reportDate").setValue(this.getDate(loaded.reportDate));
                this.formGroup.get("isMinor").setValue(loaded.minor);
                this.formGroup.get("description").setValue(loaded.description);
                this.formGroup.get("coordLongitude").setValue(loaded.coordinates.longitude);
                this.formGroup.get("coordLatitude").setValue(loaded.coordinates.latitude);
                this.formGroup.get("coordAltitude").setValue(loaded.coordinates.altitude);
                this.loadTrail(loaded.trailId);
                this.drawMarker({latitude: loaded.coordinates.latitude,
                    longitude: loaded.coordinates.longitude});
                this.hasFormBeenInitialized = true;
            });
    }

    private getDate(dateString) {
        const momentDate = moment(dateString);
        const date = {
            year: momentDate.year(),
            month: momentDate.month() + 1,
            day: momentDate.date()
        };
        return date;
    }
}
