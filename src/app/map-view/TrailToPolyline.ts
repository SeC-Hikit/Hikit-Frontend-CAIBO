import {TrailClassification} from "../TrailClassification";

export class TrailToPolyline {

    constructor(private code: string,
                private _id: string,
                private classification: String,
                private polyline: L.Polyline,
                private background_polyline: L.Polyline) {
    }

    getCode(): string {
        return this.code;
    }

    getId(): string {
        return this._id;
    }

    getClassification(): TrailClassification {
        if (this.classification == "E") {
            return TrailClassification.E
        }
        if (this.classification == "T") {
            return TrailClassification.T
        }
        if (this.classification == "EE") {
            return TrailClassification.EE
        }
        return TrailClassification.EEA;
    }

    getPolyline(): L.Polyline {
        return this.polyline;
    }

    getBackgroundPolyline(): L.Polyline {
        return this.background_polyline;
    }

}