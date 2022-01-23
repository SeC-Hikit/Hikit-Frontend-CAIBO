import {Component, OnDestroy, OnInit} from "@angular/core";
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {
    GeoTrailService,
    Coordinates2D,
    TrailIntersectionResponse, TrailIntersection,
} from "src/app/service/geo-trail-service";
import {ImportService, TrailRawDto} from "src/app/service/import.service";
import {RestResponse} from "src/app/RestResponse";
import {Status} from "src/app/Status";
import {AdminTrailRawService} from "src/app/service/admin-trail-raw.service";
import {TrailResponse, FileDetailsDto, TrailDto} from "src/app/service/trail-service.service";
import {CreatedPlaceRefDto, TrailImportFormUtils} from "src/app/utils/TrailImportFormUtils";
import * as moment from "moment";
import {AuthService} from "../../../service/auth.service";
import {AdminTrailService} from "../../../service/admin-trail.service";
import {IndexCoordinateSelector} from "./location-entry/location-entry.component";
import {PlaceDto, PlaceRefDto, PlaceResponse, PlaceService} from "../../../service/place.service";
import {environment} from "../../../../environments/environment";
import {AdminPlaceService} from "../../../service/admin-place.service";

@Component({
    selector: "app-trail-upload-management",
    templateUrl: "./trail-upload-management.component.html",
    styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {
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
            startPos: TrailImportFormUtils.getLocationFormGroup(),
            finalPos: TrailImportFormUtils.getLocationFormGroup(),
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

    onSetPlace(indexCoordinateSelector: IndexCoordinateSelector): void {

    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onAddLocation(): void {
        this.locations.push(TrailImportFormUtils.getLocationFormGroup());
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
            this.errors = []; //this.checkLocationsForErrors();
            return true;
        }


        if (this.errors.length == 0) {
            this.STEP_INDEX++;
            this.scrollUp();
            return false; // prevents the submission
        }
    }


    private checkGeneralInfoForErrors(): string[] {
        let errors = [];
        if (!this.trailFormGroup.get("code").valid) errors.push("'Codice sentiero' non completato");
        if (!this.trailFormGroup.get("description").valid) errors.push("Descrizione non completata, ma richiesta");
        return errors;
    }

    private checkCrossingsForErrors(): string[] {
        let errors = [];
        if (!this.intersections.valid)
            errors.push("Uno o più crocevia non sono stati ancora geolocalizzati o completati");
        return errors;
    }

    private checkLocationsForErrors(): string[] {
        let errors = [];
        if (!this.trailFormGroup.get("code").valid) errors.push("'Codice sentiero' non completato");
        if (!this.trailFormGroup.get("description").valid) errors.push("Descrizione non completata, ma richiesta");
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
        this.firstPos.controls["name"].setValue("");
        this.firstPos.controls["latitude"].setValue(tpm.startPos.latitude);
        this.firstPos.controls["longitude"].setValue(tpm.startPos.longitude);
        this.firstPos.controls["altitude"].setValue(tpm.startPos.altitude);
        this.firstPos.controls["distanceFromTrailStart"].setValue(
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
        console.log(this.trailFormGroup);

        let error = [];

        if (this.trailFormGroup.valid) {
            // return;
            this.isLoading = true;

            // Grab values
            const trailFormValue = this.trailFormGroup.value;
            const importTrail = this.getTrailFromForm(trailFormValue);


            // create places if they do not exist
            // let places: PlaceRefDto[] = importTrail.locations;
            let processedPlaces: CreatedPlaceRefDto[] = [];

            const intermediatePlaces = this.locations.controls;
            const placesControls = [this.firstPos as AbstractControl]
                .concat(intermediatePlaces).concat(this.finalPos as AbstractControl);

            for (const place of placesControls) {
                const placeId = place.get("id").value.trim();
                if (placeId == "") {
                    /**
                     * Currently, we shall start creating the place with the first pair of coordinates.
                     * Later, upon creating the trail, we shall assign the missing cross Trail ID
                     */
                    console.log("Place does not exist, going to create it...")
                    let response = await this.adminPlaceService.create({
                        name: place.get("name").value.trim(),
                        crossingTrailIds: [],
                        id: null,
                        description: place.get("description").value,
                        coordinates: [],
                        mediaIds: [],
                        tags: [place.get("tags").value.split(",").map(t => t.trim())],
                        recordDetails: {
                            uploadedOn: moment().toDate().toISOString(),
                            onInstance: environment.instance,
                            realm: importTrail.fileDetailsDto.realm,
                            uploadedBy: importTrail.fileDetailsDto.uploadedBy
                        }
                    }).toPromise();
                    if (response.content.length > 0) {
                        const cp: PlaceDto = response.content[0];
                        const placeRefFromPlaceCreation: PlaceRefDto = {
                            placeId: cp.id,
                            name: cp.name,
                            coordinates: cp.coordinates[0]
                        }
                        processedPlaces.push({isCreatedPlace: true, placeRef: placeRefFromPlaceCreation});
                    } else {
                        error.push("Could not create place. Check the response or the backend logs.")
                    }
                } else {
                    console.log("Place appears to exist, going to check...")
                    let response = await this.placeService
                        .getById(placeId).toPromise();
                    if (response.content.length == 0) {
                        throw new Error("Place should exists but it does not exist!");
                    }
                    const cp: PlaceDto = response.content[0];

                    const placeRef: PlaceRefDto = {
                        placeId: cp.id, name: cp.name,
                        coordinates: {
                            altitude: place.get("altitude").value,
                            latitude: place.get("latitude").value,
                            longitude: place.get("longitude").value,
                        }
                    };
                    processedPlaces.push({isCreatedPlace: false, placeRef: placeRef});
                }
            }

            importTrail.startLocation = processedPlaces[0].placeRef;
            importTrail.endLocation = processedPlaces[processedPlaces.length - 1].placeRef;
            importTrail.locations = processedPlaces.map((it) => it.placeRef);

            this.adminTrailSaveService
                .saveTrail(importTrail)
                .subscribe(async (response) => {
                    if (response.status != "OK" || response.content.length == 0) {
                        throw new Error("An error occurred with saving the trail");
                    }

                    let savedTrail = response.content[0];

                    for (const pp of processedPlaces) {
                        await this.processPlace(pp, savedTrail);
                    }

                    // Create intersections in case they did not exist
                    this.createIntersectionPlaces(savedTrail.id,
                        this.intersections.controls.filter((c) => c.get("id").value.trim() == ""))
                    // ... update the ones that exist
                    this.updateIntersectionPlaces(savedTrail.id,
                        this.intersections.controls.filter((c) => c.get("id").value.trim() != ""))

                    console.log(`Going to remove trail raw file with ${this.trailRawDto.id}...`)
                    this.rawTrailService.deleteById(this.trailRawDto.id);

                    this.onSaveRequest(response);
                });

        }
    }

    private async processPlace(pp: CreatedPlaceRefDto, tr: TrailDto) {
        let byId = await this.placeService.getById(pp.placeRef.placeId).toPromise();
        if (byId.content.length == 0) {
            throw new Error("Place does not exist, but it should have been created");
        }
        let targetPlace = byId.content[0];

        if (!pp.isCreatedPlace) {
            targetPlace.crossingTrailIds.push(tr.id);
            targetPlace.coordinates.push(pp.placeRef.coordinates);
        }
        this.adminPlaceService.update(targetPlace).subscribe((response) => {
            if (response.status != "OK") {
                throw new Error("An issue occurred with updating the place with ID='" + targetPlace.id + "'");
            }
        });
    }

    private getErrors(form: FormGroup) {
        const result = [];
        Object.keys(form.controls).forEach(key => {

            const controlErrors: ValidationErrors = form.get(key).errors;
            if (controlErrors) {
                Object.keys(controlErrors).forEach(keyError => {
                    result.push({
                        'control': key,
                        'error': keyError,
                        'value': controlErrors[keyError]
                    });
                });
            }
        });

        return result;
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
                        TrailImportFormUtils.getLocationFormGroupFromIntersection(intersection);
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

    onIntersectionPlaceFound() {

    }

    togglePlacePicker() {
        this.isPlacePicking = !this.isPlacePicking;
    }

    onLoad(restResponse: RestResponse): void {
        if (restResponse.status === Status.OK) {
            this.router.navigate([
                "/admin/trails",
                {success: this.trailRawDto.name},
            ]);
        }
    }

    private getTrailFromForm(trailFormValue) {
        return TrailImportFormUtils.getImportRequestFromControls(trailFormValue,
            this.trailRawDto.coordinates.map(tc => {
                return {
                    latitude: tc.latitude,
                    longitude: tc.longitude,
                    altitude: tc.altitude
                }
            }),
            this.trailRawDto.fileDetails);
    }

    private createIntersectionPlaces(newlyCreatedTrailId: string,
                                     intersectionsControls: AbstractControl[]) {
        let realm = this.authHelper.getRealm();
        this.authHelper.getUsername().then((username) => {
            return TrailImportFormUtils.getNewIntersectionRequestFromControls(
                newlyCreatedTrailId, username,
                realm, intersectionsControls);
        });
    }

    private updateIntersectionPlaces(newlyCreatedTrailId: string,
                                     intersectionControls: AbstractControl[]) {
        intersectionControls.forEach((it) => {
            let placeId = it.get("id").value;
            let coords = {
                longitude: it.get("latitude").value,
                altitude: it.get("altitude").value,
                latitude: it.get("longitude").value
            };
            this.placeService.getById(placeId).subscribe((placeResponse) => {
                if (placeResponse.content.length == 0) {
                    console.error("Cannot update place with id '" + placeId + "'")
                    return;
                }
                let electedPlace = placeResponse.content[0];
                electedPlace.crossingTrailIds.push(newlyCreatedTrailId);
                electedPlace.coordinates.push(coords);
                this.adminPlaceService.update(electedPlace);
            });
        })
    }

    private onSaveRequest(response: TrailResponse) {
        this.router.navigate(['/admin/trail', {success: response.content[0].code}]);
    }

    get locations(): FormArray {
        return this.trailFormGroup.controls["locations"] as FormArray;
    }

    get firstPos() {
        return this.trailFormGroup.controls["startPos"] as FormGroup;
    }

    get finalPos() {
        return this.trailFormGroup.controls["finalPos"] as FormGroup;
    }


    get intersections() {
        return this.trailFormGroup.controls["intersections"] as FormArray;
    }
}
