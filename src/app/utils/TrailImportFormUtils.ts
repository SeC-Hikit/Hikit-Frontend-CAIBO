import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Coordinates2D, TrailIntersection} from "../service/geo-trail-service";
import {TrailImportRequest} from "../service/import.service";
import {FileDetailsDto} from "../service/trail-service.service";

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
        return new FormGroup({
            "id": new FormControl("", Validators.minLength(0)),
            "name": new FormControl("", Validators.minLength(0)),
            "tags": new FormControl(""),
            "latitude": new FormControl(intersection.points[0].latitude, Validators.required),
            "longitude": new FormControl(intersection.points[0].longitude, Validators.required),
            "altitude": new FormControl(intersection.points[0].altitude, Validators.required),
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
                                        fileDetailsDto : FileDetailsDto): TrailImportRequest {
        console.log(tfv);

        return {
            code: tfv.code,
            classification: tfv.classification,
            country: "Italy",
            description: tfv.description,
            trailStatus: "DRAFT",
            lastUpdate: tfv.lastUpdate.day + "-" + tfv.lastUpdate.month + "-" + tfv.lastUpdate.year,
            maintainingSection: tfv.maintainingSection,
            linkedMediaDtos: [],
            territorialDivision: "",
            name: tfv.name,
            variant: false,
            officialEta: tfv.officialEta,
            startLocation: {
                name: tfv.startPos.name,
                placeId: tfv.startPos.id,
                coordinates: {
                    altitude: tfv.startPos.altitude,
                   longitude: tfv.startPos.altitude,
                    latitude: tfv.startPos.longitude,
                }
            },
            endLocation: {
                name: tfv.finalPos.name,
                placeId: tfv.finalPos.id,
                coordinates: {
                    altitude: tfv.finalPos.altitude,
                    longitude: tfv.finalPos.altitude,
                    latitude: tfv.finalPos.longitude,
                }
            },
            coordinates: coordinates,
            locations: tfv.locations.map(l=> {
                return {
                    name: l.name,
                    placeId: l.id,
                    coordinates: {
                        altitude: l.altitude,
                        longitude: l.altitude,
                        latitude: l.longitude,
                    }
                }
            }),
            fileDetailsDto: fileDetailsDto
        };
    }

// {
//     "code": "801aBO",
//     "eta": "",
//     "name": "",
//     "classification": "T",
//     "description": "Ozzano Dell'emilia - Sant'Andrea - La Torre",
//     "lastUpdate": {
//         "year": 2021,
//         "day": 22,
//         "month": 10
//     },
//     "intersections": [],
//     "maintainingSection": "cai-bologna",
//     "startPos": {
//         "name": "avc",
//         "tags": "",
//         "latitude": 44.44203409902705,
//         "longitude": 11.473108400502145,
//         "altitude": 0,
//         "distanceFromTrailStart": 0
//     },
//     "finalPos": {
//         "name": "cde",
//         "tags": "",
//         "latitude": 44.403291399463534,
//         "longitude": 11.460721299425249,
//         "altitude": 0,
//         "distanceFromTrailStart": 6975
//     },
//     "locations": [
//         {
//             "name": "1234",
//             "tags": "",
//             "latitude": "",
//             "longitude": "",
//             "altitude": "",
//             "distanceFromTrailStart": ""
//         }
//     ],
//     "cyclo": {
//         "classification": "TC+",
//         "wayForward": {
//             "feasible": "true",
//             "portage": "0"
//         },
//         "wayBack": {
//             "feasible": "true",
//             "portage": "15"
//         },
//         "description": ""
//     }
// }
}