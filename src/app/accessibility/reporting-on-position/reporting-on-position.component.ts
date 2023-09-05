import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {InfoModalComponent} from "../../modal/info-modal/info-modal.component";
import {TrailImportFormUtils} from "../../utils/TrailImportFormUtils";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GeoToolsService} from "../../service/geotools.service";
import {Marker} from "../../map-preview/map-preview.component";
import {CoordinatesDto, TrailDto} from "../../service/trail-service.service";
import {GeoTrailService} from "../../service/geo-trail-service";

@Component({
    selector: 'app-reporting-on-position',
    templateUrl: './reporting-on-position.component.html',
    styleUrls: ['./reporting-on-position.component.scss']
})
export class ReportingOnPositionComponent implements OnInit {
    isLoading: boolean = true;
    formGroup: FormGroup = new FormGroup({
        position: TrailImportFormUtils.getLocationForGroup(),
        email: new FormControl("", [Validators.email, Validators.required]),
        trailId: new FormControl("", Validators.required),
    });
    hasBeenGeolocalised: boolean = false;
    mapMarkers: Marker[] = [];
    trailList: TrailDto[] = [];
    specifiedPosition: CoordinatesDto;


    constructor(private modalService: NgbModal,
                private geoToolsService: GeoToolsService,
                private geoTrailService: GeoTrailService) {
    }

    ngOnInit(): void {
        this.isLoading = false;
    }

    onSubmit() {

    }

    private noticeErrorModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    onGeolocatingPosition() {
        if (navigator.geolocation) {
            this.isLoading = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;

                    // TODO: make this call with a certain delay
                    this.geoToolsService.getAltitude({longitude, latitude})
                        .subscribe((resp) => {

                            const boundary = 0.00425;
                            this.geoTrailService.locate({
                                rectangleDto: {
                                    bottomLeft: {longitude: longitude - boundary, latitude: latitude - boundary},
                                    topRight: {longitude: longitude + boundary, latitude: latitude + boundary}
                                },
                                trailIdsNotToLoad: []}).subscribe((resp)=> {
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
        this.formGroup.get("position").get("latitude").setValue(latitude);
        this.formGroup.get("position").get("longitude").setValue(longitude);
        this.formGroup.get("position").get("altitude").setValue(altitude);
    }

    get position() {
        return this.formGroup.controls["position"] as FormGroup;
    }
}
