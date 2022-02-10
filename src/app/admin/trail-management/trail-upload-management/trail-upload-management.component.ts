import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {
    Coordinates2D,
    GeoTrailService,
    TrailIntersection,
    TrailIntersectionResponse,
} from "src/app/service/geo-trail-service";
import {ImportService, TrailRawDto} from "src/app/service/import.service";
import {RestResponse} from "src/app/RestResponse";
import {Status} from "src/app/Status";
import {AdminTrailRawService} from "src/app/service/admin-trail-raw.service";
import {FileDetailsDto, TrailDto, TrailResponse} from "src/app/service/trail-service.service";
import {TrailImportFormUtils} from "src/app/utils/TrailImportFormUtils";
import * as moment from "moment";
import {AuthService} from "../../../service/auth.service";
import {AdminTrailService} from "../../../service/admin-trail.service";
import {PlaceRefDto, PlaceResponse, PlaceService} from "../../../service/place.service";
import {AdminPlaceService} from "../../../service/admin-place.service";
import {TrailDataForSaving, TrailSaveProcessHelper} from "./TrailSaveProcessHelper";

@Component({
    selector: "app-trail-upload-management",
    templateUrl: "./trail-upload-management.component.html",
    styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {

    private trailSaveProcessHelper: TrailSaveProcessHelper;

    PLACE_OFFSET = 1;

    trailFormGroup: FormGroup;
    trailRawDto: TrailRawDto;
    otherTrailResponse: TrailResponse;
    intersectionResponse: TrailIntersectionResponse;
    geoLocatedPlaceResponse: PlaceResponse;
    fileDetails: FileDetailsDto;

    date: NgbDateStruct;

    isLoading = false;
    isPlaceListLoading = false;
    isPreviewVisible = false;
    isCrossingSectionComplete = false;
    isPlacePicking = false;
    isError: boolean;

    closeResult: string;

    trailsInArea: TrailDto[] = [];

    intersectionTrails: TrailDto[] = [];
    crossPointOnTrail: Coordinates2D[] = [];

    crossingGeolocationExecutedChecks: boolean[] = [];

    STEPS = ["Info Generali", "Crocevia", "Località"];

    private GENERAL_INFO_INDEX = 0;
    private CROSSWAY_INDEX = 1;
    private LOCATION_INDEX = 2;

    STEP_INDEX = 0;

    errors = [];

    private destroy$ = new Subject();
    today = moment()
    maxDate: NgbDateStruct = {
        year: this.today.year(),
        month: this.today.month() + 1,
        day: this.today.date()
    };


    constructor(
        private geoTrailService: GeoTrailService,
        private rawTrailService: AdminTrailRawService,
        private trailImportService: ImportService,
        private adminTrailSaveService: AdminTrailService,
        private placeService: PlaceService,
        private adminPlaceService: AdminPlaceService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private authHelper: AuthService
    ) {
    }

    ngOnInit(): void {
        this.trailSaveProcessHelper =
            new TrailSaveProcessHelper(
                this.placeService,
                this.adminTrailSaveService);
        const currentDate = moment(new Date());

        this.date = {year: currentDate.year(), day: currentDate.date(), month: currentDate.month() + 1}

        this.trailFormGroup = new FormGroup({
            code: new FormControl("", Validators.required),
            officialEta: new FormControl(""),
            name: new FormControl(""),
            classification: new FormControl("T", Validators.required),
            description: new FormControl("", Validators.required),
            lastUpdate: new FormControl(""),
            intersections: new FormArray([]),
            maintainingSection: new FormControl(this.authHelper.getSection(), Validators.required),
            startPos: TrailImportFormUtils.getLocationForGroup(),
            finalPos: TrailImportFormUtils.getLocationForGroup(),
            locations: new FormArray([]),
        });

        const idFromPath: string = this.route.snapshot.paramMap.get("id");
        this.loadRaw(idFromPath);
    }

    loadRaw(idFromPath: string) {
        this.isLoading = true;
        this.rawTrailService.getById(idFromPath).subscribe((response) => {
            if (response.content.length == 0) {
                alert("No raw trail found with id " + idFromPath);
                this.isError = true;
                return;
            }
            this.trailRawDto = response.content[0];
            this.fileDetails = this.trailRawDto.fileDetails;
            this.populateForm(this.trailRawDto);
            this.isLoading = false;
        });
    }

    onSetPlace(): void {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onAddLocation(): void {
        this.locations.push(TrailImportFormUtils.getLocationForGroup());
    }

    onReload(): void {
        this.isLoading = false;
    }

    proceed(): boolean {
        if (this.STEP_INDEX == this.GENERAL_INFO_INDEX) {
            this.errors = this.checkGeneralInfoForErrors();
            if (this.errors.length == 0) this.onDetectCrossings();
        }
        if (this.STEP_INDEX == this.CROSSWAY_INDEX) {
            this.errors = this.checkCrossingsForErrors();
        }
        if (this.STEP_INDEX == this.LOCATION_INDEX) {
            this.errors = this.checkLocationsForErrors();
            return true;
        }


        if (this.errors.length == 0) {
            this.STEP_INDEX++;
            this.scrollUp();
        }
        return false;
    }


    private checkGeneralInfoForErrors(): string[] {
        const errors = [];
        if (!this.trailFormGroup.get("code").valid) errors.push("'Codice sentiero' non completato");
        if (!this.trailFormGroup.get("description").valid) errors.push("Descrizione non completata, ma richiesta");
        return errors;
    }

    private checkCrossingsForErrors(): string[] {
        const errors = [];
        if (!this.intersections.valid)
            errors.push("Uno o più crocevia non sono stati ancora geolocalizzati o completati");
        return errors;
    }

    private checkLocationsForErrors(): string[] {
        const errors = [];
        if (!this.startPos.get("id").value) this.startPos.get("id").setValue(" ");
        if (!this.finalPos.get("id").value) this.finalPos.get("id").setValue(" ");
        this.locations.controls.forEach(it => {
            if (!it.get("id").value) it.get("id").setValue(" ");
        })

        if (!this.startPos.valid) {
            errors.push("Località di partenza non compilata e/o geolocalizzata")
        }
        if (!this.finalPos.valid) {
            errors.push("Località d'arrivo non compilata e/o geolocalizzata")
        }
        if (!this.locations.valid) {
            errors.push("Località intermedie non compilate e/o geolocalizzate")
        }
        return errors;
    }

    goBack(): void {
        this.STEP_INDEX--;
        this.scrollUp();
    }

    scrollUp() {
        window.scrollTo(0, 0);
    }

    populateForm(tpm: TrailRawDto) {
        this.trailFormGroup.controls["officialEta"].setValue(0);
        this.trailFormGroup.controls["code"].setValue(tpm.name);
        this.trailFormGroup.controls["description"].setValue(tpm.description);
        this.startPos.controls["name"].setValue("");
        this.startPos.controls["latitude"].setValue(tpm.startPos.latitude);
        this.startPos.controls["longitude"].setValue(tpm.startPos.longitude);
        this.startPos.controls["altitude"].setValue(tpm.startPos.altitude);
        this.startPos.controls["distanceFromTrailStart"].setValue(
            tpm.startPos.distanceFromTrailStart
        );
        this.finalPos.controls["name"].setValue("");
        this.finalPos.controls["latitude"].setValue(tpm.finalPos.latitude);
        this.finalPos.controls["longitude"].setValue(tpm.finalPos.longitude);
        this.finalPos.controls["altitude"].setValue(tpm.finalPos.altitude);
        this.finalPos.controls["distanceFromTrailStart"].setValue(
            tpm.finalPos.distanceFromTrailStart
        );
    }

    togglePreview() {
        this.isPreviewVisible = !this.isPreviewVisible;
    }

    async processForm() {

        if (this.trailFormGroup.valid) {
            // return;
            this.isLoading = true;

            let realm = this.authHelper.getRealm();
            let username = await this.authHelper.getUsername();

            // Grab values
            const trailFormValue = this.trailFormGroup.value;

            // Add import trail data
            const trailData: TrailDataForSaving =
                TrailImportFormUtils.getImportRequestFromControls(trailFormValue,
                    this.trailRawDto.coordinates.map(tc => {
                        return {
                            latitude: tc.latitude,
                            longitude: tc.longitude,
                            altitude: tc.altitude
                        }
                    }),
                    this.trailRawDto.fileDetails);

            // Grap intersection data
            let intersectionPlacesDto: PlaceRefDto[] =
                this.intersections.controls.map(it => {
                        return TrailImportFormUtils
                            .getPlaceRefFromFormControl(
                                username, realm, it);
                    }
                );

            // Grab locations data
            let locationPlacesDto: PlaceRefDto[] =
                [TrailImportFormUtils
                    .getPlaceRefFromFormControl(
                        username, realm, this.startPos)].concat(
                    this.locations.controls.map(it => {
                        return TrailImportFormUtils
                            .getPlaceRefFromFormControl(
                                username, realm, it);
                    }).concat([TrailImportFormUtils
                        .getPlaceRefFromFormControl(
                            username, realm, this.finalPos)])
                );


            await this.trailSaveProcessHelper.startProcessing(
                trailData,
                intersectionPlacesDto,
                locationPlacesDto,
                (trailData) => {
                    this.rawTrailService.deleteById(this.trailRawDto.id)
                        .toPromise().then((result) => {
                        this.onSaveRequest(trailData)
                    })
                })
        }
    }

    onDetectCrossings() {
        this.toggleLoading();
        let coords = this.trailRawDto.coordinates;
        let coords2d: Coordinates2D[] = coords.map((a) => {
            return {latitude: a.latitude, longitude: a.longitude};
        });
        this.geoTrailService
            .intersect({coordinates: coords2d})
            .subscribe((response) => {
                this.crossingGeolocationExecutedChecks = [];
                this.intersectionResponse = response;
                response.content.forEach((intersection: TrailIntersection) => {
                    let metPoint = intersection.points[0];
                    this.intersectionTrails.push(intersection.trail);
                    this.crossPointOnTrail.push(metPoint);
                    let locationFormGroupFromIntersection =
                        TrailImportFormUtils.getLocationFormGroupForIntersection(intersection);
                    this.intersections.push(locationFormGroupFromIntersection);
                    this.crossingGeolocationExecutedChecks.push(false);
                })
                this.isCrossingSectionComplete = true;
                this.toggleLoading();
            });
    }

    toggleLoading() {
        this.isLoading = !this.isLoading;
    }

    togglePlacePicker() {
        this.isPlacePicking = !this.isPlacePicking;
    }

    onLoad(restResponse: RestResponse): void {
        if (restResponse.status === Status.OK) {
            this.router.navigate([
                "/admin/trails",
                {
                    success: this.trailRawDto.name
                },
            ]);
        }
    }

    onDeletePlace(index: number) {
        this.locations.controls.splice(index - 1, 1);
    }

    private onSaveRequest(response: TrailResponse) {
        this.router.navigate(['/admin/trail-management',
            {success: response.content[0].code}]);
    }

    get locations(): FormArray {
        return this.trailFormGroup.controls["locations"] as FormArray;
    }

    get startPos() {
        return this.trailFormGroup.controls["startPos"] as FormGroup;
    }

    get finalPos() {
        return this.trailFormGroup.controls["finalPos"] as FormGroup;
    }

    get intersections() {
        return this.trailFormGroup.controls["intersections"] as FormArray;
    }
}
