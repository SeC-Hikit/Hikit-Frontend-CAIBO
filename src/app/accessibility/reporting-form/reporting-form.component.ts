import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "src/app/service/auth.service";
import {Coordinates2D, GeoTrailService} from "src/app/service/geo-trail-service";
import {TrailPreview, TrailPreviewService,} from "src/app/service/trail-preview-service.service";
import {CoordinatesDto, TrailDto, TrailService} from "src/app/service/trail-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {Marker} from "../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {TrailImportFormUtils} from "../../utils/TrailImportFormUtils";

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

    mapMarkers: Marker[] = [];
    trailPreviews: TrailPreview[];

    foundIssues: string[] = ["Schianto d'albero su sentiero",
        "Sentiero smottato",
        "Sentiero invaso da piante",
        "Sentiero non visibile"]

    formGroup: FormGroup = new FormGroup({
        id: new FormControl("", Validators.required),
        cause: new FormControl(this.foundIssues[0], Validators.required),
        email: new FormControl("", Validators.required),
        telephone: new FormControl(""),
        position: TrailImportFormUtils.getLocationForGroup(),
    });

    isLoadingPosition: boolean = false;

    constructor(
        private trailService: TrailService,
        private trailPreviewService: TrailPreviewService,
        private geoTrailService: GeoTrailService,
        private modalService: NgbModal,
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
                    this.formGroup.get("id").setValue(firstValue);
                }
            });
    }

    private loadTrailById(trailId: string) {
        this.trailService.getTrailById(trailId).subscribe((trailResp) => {
            this.trail = trailResp.content[0];
            this.hasLoaded = true;
        });
    }

    get position() {
        return this.formGroup.controls["position"] as FormGroup;
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

    onRegisteringUserPosition() {
        if (navigator.geolocation) {
            this.isLoadingPosition = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;
                    this.specifiedPosition = {
                        longitude: longitude,
                        latitude: latitude,
                        altitude: 0
                    }
                    this.position.get("latitude").setValue(latitude);
                    this.position.get("longitude").setValue(longitude);
                    this.hasBeenGeolocalised = true;
                    this.isLoadingPosition = false;
                    this.mapMarkers = [{coords: this.specifiedPosition, icon: MapPinIconType.ALERT_PIN, color: "red"}]
                }, (error) => {
                    this.isLoadingPosition = false;
                    this.noticeErrorModal("Errore nel geolocalizzare l'utente",
                        `Non è stato possibile registrare la sua posizione. " +
                        "Usi le frecce a lato della mappa per segnalare il problema (errore='${error}')`)
                })
        } else {
            this.noticeErrorModal("Errore nel geolocalizzare l'utente", "Il suo dispositivo non supporta la" +
                " geolocalizzazione e/o non ha dato il consenso per condividere la sua posizione")
        }
    }

    private noticeErrorModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    onSlidingPositionChange($event: CoordinatesDto) {
        this.mapMarkers = [{
            coords: {longitude: $event.longitude, latitude: $event.latitude},
            icon: MapPinIconType.ALERT_PIN,
            color: "red"
        }];
        this.specifiedPosition = {
            longitude: $event.longitude,
            latitude: $event.latitude,
            altitude: 0
        }
    }
}
