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
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
    selector: "app-reporting-form",
    templateUrl: "./reporting-form.component.html",
    styleUrls: ["./reporting-form.component.scss"],
})
export class ReportingFormComponent implements OnInit {
    hasLoaded = false;
    trail: TrailDto;
    specifiedPosition: CoordinatesDto;
    errors: string[] = [];

    mapMarkers: Marker[] = [];
    trailPreviews: TrailPreview[];
    foundIssues: string[] = environment.issueReportingList;
    selectIssueCause: string = "";

    // TODO: remove form param from the map component.
    formGroupz: FormGroup = new FormGroup({
        position: TrailImportFormUtils.getLocationForGroup(),
    });
    formGroup: FormGroup = new FormGroup({
        trailId: new FormControl("", Validators.required),
        cause: new FormControl(environment.issueReportingList, Validators.required),
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
        private authService: AuthService,
        private activatedRoute: ActivatedRoute
    ) {
        const referredId = this.activatedRoute.snapshot.paramMap.get("id");
        this.loadPreviews(referredId);
    }

    ngOnInit(): void {
    }

    private loadPreviews(referredId) {
        this.trailPreviewService
            .getPreviews(0, 10000,
                this.authService.getInstanceRealm())
            .subscribe((resp) => {
                this.trailPreviews = resp.content;
                if (resp.content.length == 0) {
                    this.router.navigate(["/accessibility"]);
                }
                if (resp.content.length != 0) {
                    const firstValue = referredId ? referredId : resp.content[0].id;
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
                    realm: this.authService.getInstanceRealm(),
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
                    this.isLoading = false;
                    this.errors = ["Alcuni campi sono errati"];
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

    private noticeErrorModal(title: string, body: string) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = title;
        modal.componentInstance.body = body;
    }

    private noticeErrorsModal(errors: string[]) {
        const modal = this.modalService.open(InfoModalComponent);
        modal.componentInstance.title = `Errore nel salvataggio della notifica:`;
        errors.map(it=> "<b>" + it + "</b>");
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

    selectIssue($event: any) {
        this.selectIssueCause = $event.target.value;
    }

    setNoteIssue($event: any) {
        this.formGroup.get("cause").setValue($event.target.value);
    }
}
