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
        trailId: new FormControl("", Validators.required),
        reportDate: new FormControl("", Validators.required),
        isMinor: new FormControl(true, Validators.required),
        description: new FormControl("", Validators.required),
        coordLongitude: new FormControl("", Validators.required),
        coordLatitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required)
    });

    markers: Marker[];
    trailMappings: TrailMappingDto[];
    selectedTrails: TrailDto[] = [];
    hasFormBeenInitialized: boolean = false;

    validationErrors: string[] = [];

    constructor(
        private trailPreviewService: TrailPreviewService,
        private adminNotificationService: AdminNotificationService,
        private trailService: TrailService,
        private accessibility: NotificationService,
        private geoToolService: GeoToolsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit(): void {
        const realm = this.authService.getRealm();
        this.hasFormBeenInitialized = true;
        this.trailPreviewService.getMappings(realm)
            .subscribe(resp => {
                this.trailMappings = resp.content;
            })
    }

    onChanges($event: any): void {
        const id = $event.target.value;
        this.trailService.getTrailById(id).subscribe(resp =>
            this.selectedTrails = [...resp.content]
        );
    }

    onSaveNotification() {
        this.validationErrors = [];
        if (this.formGroup.valid) {
            const objValue = this.formGroup.value;
            let reportedDate = objValue.reportDate;
            let trailId = this.formGroup.get("trailId").value;
            let isMinor = this.formGroup.get("isMinor").value;
            let date = moment(reportedDate.year +
                "-" + reportedDate.month +
                "-" + reportedDate.day).toDate()

            this.authService.getUsername().then((name) => {
                const not: AccessibilityNotification = {
                    id: null,
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
                        realm: this.authService.getRealm(),
                        onInstance: environment.instance
                    }
                };

                this.adminNotificationService.createNotification(not)
                    .subscribe((resp) => {
                        if(resp.status == "OK") {
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
        this.markers = [{
            icon: MapPinIconType.PIN,
            coords: coords,
            color: "#1D9566"
        }];
        this.geoToolService.getAltitude(coords).subscribe((resp) => {
            this.formGroup.get("coordLongitude").setValue(resp.longitude);
            this.formGroup.get("coordLatitude").setValue(resp.latitude);
            this.formGroup.get("coordAltitude").setValue(resp.altitude);
        })
    }

    private noticeErrorModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio della notifica`;
        const errorsString = errors.join("<br>")
        modal.componentInstance.body = `<ul>I seguenti errori imepdiscono il salvataggio: <br/>${errorsString}</ul>`;
    }

}
