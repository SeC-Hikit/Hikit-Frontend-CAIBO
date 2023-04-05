import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Coordinates2D, TrailIntersection} from "../service/geo-trail-service";
import {CoordinatesDto, FileDetailsDto} from "../service/trail-service.service";
import * as moment from "moment";
import {DateUtils} from "./DateUtils";
import {PlaceRefDto} from "../service/place.service";
import {TrailDataForSaving} from "../admin/trail-management/trail-upload-management/TrailSaveProcessHelper";

export interface CreatedPlaceRefDto {
    placeRef: PlaceRefDto,
    isCreatedPlace: boolean
}

export class TrailImportFormUtils {

    public static DEFAULT_CYCLO = "UNCLASSIFIED";

    public static getLocationForGroup() {
        return new FormGroup({
            "id": new FormControl("", {validators: null}), // one char empty string - Strange issue
            "name": new FormControl("", [Validators.required,
                Validators.minLength(2),
                TrailImportFormUtils.nameValidator]),
            "crossingTrailIds": new FormControl(""),
            "latitude": new FormControl("", Validators.required),
            "longitude": new FormControl("", Validators.required),
            "altitude": new FormControl("", Validators.required),
            "distanceFromTrailStart": new FormControl("", Validators.required)
        });
    }

    public static getLocationFormGroupForIntersection(intersection: TrailIntersection, point: CoordinatesDto) {
        let intersectionCoords = point;
        return new FormGroup({
            "id": new FormControl(" "), // one char empty string - Strange issue
            "name": new FormControl("", [
                Validators.required,
                Validators.minLength(2),
                TrailImportFormUtils.nameValidator]),
            "crossingTrailIds": new FormControl(intersection.trail.id),
            "isDynamic": new FormControl(false),
            "latitude": new FormControl(intersectionCoords.latitude, Validators.required),
            "longitude": new FormControl(intersectionCoords.longitude, Validators.required),
            "altitude": new FormControl(intersectionCoords.altitude, Validators.required),
            "distanceFromTrailStart": new FormControl("0"),
        });
    }

    public static getLocationFormGroupForQuickIntersection(
        intersection: TrailIntersection, 
        point: CoordinatesDto,
        trailCode: String, 
        otherTrailCode: String) {
        return new FormGroup({
            "id": new FormControl(" "), // one char empty string - Strange issue
            "name": new FormControl("Crocevia " + trailCode + "/" + otherTrailCode,
                [Validators.required,
                Validators.minLength(2),
                TrailImportFormUtils.nameValidator]),
            "crossingTrailIds": new FormControl(intersection.trail.id),
            "isDynamic": new FormControl(true),
            "latitude": new FormControl(point.latitude, Validators.required),
            "longitude": new FormControl(point.longitude, Validators.required),
            "altitude": new FormControl(point.altitude, Validators.required),
            "distanceFromTrailStart": new FormControl("0"),
        });
    }

    public static getCycloFormGroup() {
        return new FormGroup({
            "classification": new FormControl(this.DEFAULT_CYCLO, Validators.required),
            "wayForward": this.getWayCylcloFormGroup(),
            "wayBack": this.getWayCylcloFormGroup(),
            "description": new FormControl(""),
            "officialEta": new FormControl(""),
        });
    }

    public static getWayCylcloFormGroup() {
        return new FormGroup({
            "feasible": new FormControl("", Validators.required),
            "portage": new FormControl("", Validators.required),
        });
    }

    static getImportRequestFromControls(tfv: any,
                                        coordinates: Coordinates2D[],
                                        fileDetailsDto: FileDetailsDto): TrailDataForSaving {
        return {
            code: tfv.code,
            classification: tfv.classification,
            country: "Italy",
            description: tfv.description,
            trailStatus: "PUBLIC",
            lastUpdate: moment(DateUtils.formatStringDateToDashes(
                    tfv.lastUpdate.day, tfv.lastUpdate.month, tfv.lastUpdate.year),
                DateUtils.DATE_FORMAT).toISOString(),
            maintainingSection: tfv.maintainingSection,
            linkedMediaDtos: [],
            territorialDivision: "",
            name: tfv.name,
            variant: false,
            officialEta: tfv.officialEta,
            coordinates: coordinates,
            fileDetailsDto: fileDetailsDto
        };
    }

    static getPlaceRefFromFormControl(username: string, realm: string,
                                      control: AbstractControl): PlaceRefDto {
        let coords = {
            longitude: control.get("longitude").value,
            altitude: control.get("altitude").value,
            latitude: control.get("latitude").value
        };
        return {
            placeId: control.get("id").value.trim(),
            name: control.get("name").value,
            coordinates: coords,
            dynamicCrossway: control.get("isDynamic") ? control.get("isDynamic").value : false,
            encounteredTrailIds: control.get("crossingTrailIds")
                .value.split(",").map(t => t.trim()).filter(t => t && t != "")
        }
    }

    static nameValidator(control: FormControl): ValidationErrors | null {
        if (control.value.trim().length == 0) {
            return ["Not good"];
        }
        return null;
    }

}