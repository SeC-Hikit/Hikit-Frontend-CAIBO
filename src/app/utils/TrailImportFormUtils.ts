import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Coordinates2D, TrailIntersection} from "../service/geo-trail-service";
import {TrailImportRequest} from "../service/import.service";
import {FileDetailsDto} from "../service/trail-service.service";
import * as moment from "moment";
import {DateUtils} from "./DateUtils";
import {PlaceRefDto} from "../service/place.service";

export interface CreatedPlaceRefDto {
    placeRef : PlaceRefDto,
    isCreatedPlace: boolean
}

export class TrailImportFormUtils {

    public static DEFAULT_CYCLO = "UNCLASSIFIED";

    public static getLocationFormGroup() {
        return new FormGroup({
            "name": new FormControl("", Validators.minLength(0)),
            "tags": new FormControl(""),
            "latitude": new FormControl("", Validators.required),
            "longitude": new FormControl("", Validators.required),
            "altitude": new FormControl("", Validators.required),
            "distanceFromTrailStart": new FormControl("", Validators.required)
        });
    }

    public static getLocationFormGroupFromIntersection(intersection: TrailIntersection) {
        let intersectionCoords = intersection.points[0];
        return new FormGroup({
            "id": new FormControl("", Validators.minLength(0)),
            "name": new FormControl("", Validators.minLength(0)),
            "latitude": new FormControl(intersectionCoords.latitude, Validators.required),
            "longitude": new FormControl(intersectionCoords.longitude, Validators.required),
            "altitude": new FormControl(intersectionCoords.altitude, Validators.required),
        });
    }

    public static getCylcloFormGroup() {
        return new FormGroup({
            "classification": new FormControl(this.DEFAULT_CYCLO, Validators.required),
            "wayForward": this.getWayCylcloFormGroup(),
            "wayBack": this.getWayCylcloFormGroup(),
            "description": new FormControl(""),
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
                                        fileDetailsDto: FileDetailsDto): TrailImportRequest {
        console.log(tfv);

        let mappedStartLocation = {
            name: tfv.startPos.name,
            placeId: tfv.startPos.id,
            coordinates: {
                altitude: tfv.startPos.altitude,
                longitude: tfv.startPos.longitude,
                latitude: tfv.startPos.longitude,
            }
        };
        let mappedEndLocation = {
            name: tfv.finalPos.name,
            placeId: tfv.finalPos.id,
            coordinates: {
                altitude: tfv.finalPos.altitude,
                longitude: tfv.finalPos.longitude,
                latitude: tfv.finalPos.longitude,
            }
        };
        let mappedIntermediateLocations = tfv.locations.map(l => {
            return {
                name: l.name,
                placeId: l.id,
                coordinates: {
                    altitude: l.altitude,
                    longitude: l.longitude,
                    latitude: l.longitude,
                }
            }
        });
        return {
            code: tfv.code,
            classification: tfv.classification,
            country: "Italy",
            description: tfv.description,
            trailStatus: "DRAFT",
            lastUpdate: moment(DateUtils.formatStringDateToDashes(tfv.lastUpdate.day, tfv.lastUpdate.month, tfv.lastUpdate.year),
                DateUtils.DATE_FORMAT).toISOString(),
            maintainingSection: tfv.maintainingSection,
            linkedMediaDtos: [],
            territorialDivision: "",
            name: tfv.name,
            variant: false,
            officialEta: tfv.officialEta,
            startLocation: mappedStartLocation,
            endLocation: mappedEndLocation,
            coordinates: coordinates,
            locations: [mappedStartLocation].concat(
                mappedIntermediateLocations)
                .concat([mappedEndLocation]),
            fileDetailsDto: fileDetailsDto
        };
    }

}