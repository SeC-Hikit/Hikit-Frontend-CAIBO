import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "src/app/service/auth.service";
import {GeoTrailService} from "src/app/service/geo-trail-service";
import {TrailPreview, TrailPreviewService,} from "src/app/service/trail-preview-service.service";
import {CoordinatesDto, TrailDto, TrailService} from "src/app/service/trail-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {Marker} from "../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {TrailImportFormUtils} from "../../utils/TrailImportFormUtils";
import {AccessibilityReportDto} from "../../service/accessibility-service.service";
import {GeoToolsService} from "../../service/geotools.service";
import {NotificationReportService} from "../../service/notification-report-service.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-reporting-form",
    templateUrl: "./reporting-form.component.html",
    styleUrls: ["./reporting-form.component.scss"],
})
export class ReportingFormComponent implements OnInit {
    hasLoaded = false;
    hasBeenGeolocalised = false;
    trail: TrailDto;
    specifiedPosition: CoordinatesDto;
    errors: string[] = [];

    mapMarkers: Marker[] = [];
    trailPreviews: TrailPreview[];

    foundIssues: string[] = [
        "Schianto d'albero su sentiero",
        "Sentiero smottato",
        "Sentiero invaso da piante",
        "Sentiero non visibile"
    ];

    // TODO: remove form param from the map component.
    formGroupz: FormGroup = new FormGroup({
        position: TrailImportFormUtils.getLocationForGroup(),
    });
    formGroup: FormGroup = new FormGroup({
        trailId: new FormControl("", Validators.required),
        cause: new FormControl(this.foundIssues[0], Validators.required),
        email: new FormControl("", [Validators.email, Validators.required]),
        telephone: new FormControl(""),
        coordLatitude: new FormControl("", Validators.required),
        coordLongitude: new FormControl("", Validators.required),
        coordAltitude: new FormControl("", Validators.required)
    });

    isLoading: boolean = false;

    constructor(
        private trailService: TrailService,
        private trailPreviewService: TrailPreviewService,
        private geoTrailService: GeoTrailService,
        private geoToolsService: GeoToolsService,
        private modalService: NgbModal,
        private notificationReportService: NotificationReportService,
        private router: Router,
        private authService: AuthService
    ) {
        this.loadPreviews();
    }

    ngOnInit(): void {
    }

    private loadPreviews() {
        this.trailPreviewService
            .getPreviews(0, 10000, this.authService.getRealm())
            .subscribe((resp) => {
                this.trailPreviews = resp.content;
                if (resp.content.length != 0) {
                    let firstValue = resp.content[0].id;
                    this.loadTrailById(firstValue);
                    this.formGroup.get("trailId").setValue(firstValue);
                }
            });
    }

    private loadTrailById(trailId: string) {
        this.trailService.getTrailById(trailId).subscribe((trailResp) => {
            this.trail = trailResp.content[0];
            this.hasLoaded = true;
        });
    }

    onSubmit() {
        this.isLoading = true;
        this.errors = [];
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
                    realm: this.authService.getRealm(),
                    onInstance: ""
                }
            }

            this.notificationReportService.report(reportDto)
                .subscribe((resp)=>{
                if(resp.status == "OK"){
                    scroll(0,0);
                    this.router.navigate(["/accessibility/success"]);
                } else {
                    this.noticeErrorsModal(resp.messages);
                }
            });

        } else {
            this.isLoading = false;
            this.errors = ["Alcuni campi sono vuoti o errati"];
        }
    }

    get position() {
        return this.formGroupz.controls["position"] as FormGroup;
    }

    selectTrail(trailSelection: any) {
        this.hasLoaded = false;
        const selectedTrailId = trailSelection.target.value;
        let trailPreview = this.trailPreviews.filter(t => t.id == selectedTrailId);
        if (trailPreview.length > 0) {
            this.loadTrailById(trailPreview[0].id);
        } else {
            this.noticeErrorModal("Errore nella selezione del sentiero", "")
        }
    }

    onGeolocatingPosition() {
        if (navigator.geolocation) {
            this.isLoading = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;

                    // TODO: make this call with a certain delay
                    this.geoToolsService.getAltitude({latitude, longitude})
                        .subscribe((resp) => {
                            const altitude = resp.altitude;
                            this.specifiedPosition = {
                                longitude: longitude,
                                latitude: latitude,
                                altitude: altitude
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
                        `Non è stato possibile registrare la sua posizione. " +
                        "Usi le frecce a lato della mappa per segnalare il problema (errore='${error}')`)
                })
        } else {
            this.noticeErrorModal("Errore nel geolocalizzare l'utente", "Il suo dispositivo non supporta la" +
                " geolocalizzazione e/o non ha dato il consenso per condividere la sua posizione")
        }
        return false;
    }

    private noticeErrorModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    private noticeErrorsModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio della notifica`;
        const errorsString = errors.join("<br>")
        modal.componentInstance.body = `<ul>I seguenti errori imepdiscono il salvataggio: <br/>${errorsString}</ul>`;
    }


    onSlidingPositionChange($event: CoordinatesDto) {
        this.mapMarkers = [{
            coords: {longitude: $event.longitude, latitude: $event.latitude},
            icon: MapPinIconType.ALERT_PIN,
            color: "red"
        }];
        this.geoToolsService.getAltitude($event).subscribe((resp) => {
            const longitude = $event.longitude;
            const latitude = $event.latitude;
            const altitude = resp.altitude;
            this.specifiedPosition = {
                longitude: longitude,
                latitude: latitude,
                altitude: altitude,
            }
            this.setPosInForm(latitude, longitude, altitude);
        })
    }

    private setPosInForm(latitude: number, longitude: number, altitude: number) {
        this.formGroup.get("coordLatitude").setValue(latitude);
        this.formGroup.get("coordLongitude").setValue(longitude);
        this.formGroup.get("coordAltitude").setValue(altitude);
    }
}
