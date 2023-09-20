import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GeoToolsService} from "../../service/geotools.service";
import {Marker} from "../../map-preview/map-preview.component";
import {CoordinatesDto, TrailDto} from "../../service/trail-service.service";
import {GeoTrailService} from "../../service/geo-trail-service";
import {environment} from "../../../environments/environment";
import {AccessibilityReportDto} from "../../service/accessibility-service.service";
import {AuthService} from "../../service/auth.service";
import {NotificationReportService} from "../../service/notification-report-service.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-reporting-on-position',
    templateUrl: './reporting-on-position.component.html',
    styleUrls: ['./reporting-on-position.component.scss']
})
export class ReportingOnPositionComponent implements OnInit {

    COLORS = ["#001021", "#1481BA", "#034748",
        "#11B5E4", "#004FA3", "#0CAADC", "#3396FF"];


    isLoading: boolean = true;
    formGroup: FormGroup = new FormGroup({
        cause: new FormControl("", Validators.required),
        telephone: new FormControl("",),
        email: new FormControl("", [Validators.email, Validators.required]),
        trailId: new FormControl("", Validators.required),
        coordLatitude: new FormControl("", Validators.required),
        coordLongitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required)
    });
    hasBeenGeolocalised: boolean = false;
    mapMarkers: Marker[] = [];
    trailList: TrailDto[] = [];
    selectedTrail: TrailDto;
    foundIssues = environment.issueReportingList;
    specifiedPosition: CoordinatesDto;
    hasBeenSelected: Boolean = false;
    formErrors: string[] = [];


    constructor(private modalService: NgbModal,
                private geoToolsService: GeoToolsService,
                private geoTrailService: GeoTrailService,
                private authService: AuthService,
                private notificationReportService: NotificationReportService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.isLoading = false;
    }

    onSubmit() {
        this.isLoading = true;
        this.formErrors = [];
        if (this.formGroup.valid) {
            const uploadedOn = new Date().toISOString();
            const reportDto: AccessibilityReportDto = {
                id: null,
                reportDate: uploadedOn,
                email: this.formGroup.get("email").value,
                coordinates: {
                    altitude: this.formGroup.get("coordAltitude").value,
                    latitude: this.formGroup.get("coordLatitude").value,
                    longitude: this.formGroup.get("coordLongitude").value,
                },
                description: this.formGroup.get("cause").value,
                issueId: "",
                telephone: this.formGroup.get("telephone").value,
                trailId: this.formGroup.get("trailId").value,
                recordDetails: {
                    uploadedOn: uploadedOn,
                    uploadedBy: "",
                    realm: this.authService.getInstanceRealm(),
                    onInstance: ""
                }
            }

            this.notificationReportService.report(reportDto)
                .subscribe((resp) => {
                    if (resp.status == "OK") {
                        scroll(0, 0);
                        this.router.navigate(["/accessibility/success"]);
                    } else {
                        this.noticeErrorsModal(resp.messages);
                        this.isLoading = false;
                        this.formErrors = ["Alcuni campi sono errati"];
                    }
                });

        } else {
            this.isLoading = false;
            this.formErrors = ["Alcuni campi sono vuoti o errati"];
        }
    }

    private noticeErrorsModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio della notifica:`;
        errors.map(it => "<b>" + it + "</b>");
        const errorsString = errors.join("<br>")
        modal.componentInstance.body = `<ul>I seguenti errori imepdiscono il salvataggio: <br/>${errorsString}</ul>`;
    }

    private noticeErrorModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    onGeolocatingPosition() {
        this.selectedTrail = null;
        if (navigator.geolocation) {
            this.isLoading = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;

                    this.geoToolsService.getAltitude({longitude, latitude})
                        .subscribe((resp) => {

                            const boundary = 0.00425;
                            this.geoTrailService.locate({
                                rectangleDto: {
                                    bottomLeft: {longitude: longitude - boundary, latitude: latitude - boundary},
                                    topRight: {longitude: longitude + boundary, latitude: latitude + boundary}
                                },
                                trailIdsNotToLoad: []
                            }).subscribe((resp) => {
                                this.trailList = resp.content;
                            })

                            const altitude = resp.altitude;
                            this.specifiedPosition = {
                                longitude: resp.longitude,
                                latitude: resp.latitude,
                                altitude: resp.altitude
                            }
                            this.setPosInForm(latitude, longitude, altitude);

                            this.hasBeenGeolocalised = true;
                            this.isLoading = false;
                            this.mapMarkers = [{
                                coords: this.specifiedPosition,
                                icon: MapPinIconType.ALERT_PIN,
                                color: "red"
                            }]
                        });
                }, (error) => {
                    this.isLoading = false;
                    this.noticeErrorModal("Errore nel geolocalizzare l'utente",
                        `Non è stato possibile registrare la sua posizione. \n
                        (errore='${error.POSITION_UNAVAILABLE}')`)
                })
        } else {
            this.noticeErrorModal("Errore nel geolocalizzare l'utente", "Il suo dispositivo non supporta la" +
                " geolocalizzazione e/o non ha dato il consenso per condividere la sua posizione")
        }
        return false;
    }

    private setPosInForm(latitude: number, longitude: number, altitude: number) {
        this.formGroup.get("coordLatitude").setValue(latitude);
        this.formGroup.get("coordLongitude").setValue(longitude);
        this.formGroup.get("coordAltitude").setValue(altitude);
    }

    get position() {
        return this.formGroup.controls["position"] as FormGroup;
    }

    onTrailSelection(trail: TrailDto) {
        this.selectedTrail = trail;
        this.formGroup.get("trailId").setValue(trail.id);
        this.formGroup.get("cause").setValue(this.foundIssues[0]);
    }
}
