import {TrailClassification} from "../TrailClassification";
import {TrailClassificationUtils} from "../TrailClassificationUtils";

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
        return TrailClassificationUtils.getClassification(this.classification);
    }

    getPolyline(): L.Polyline {
        return this.polyline;
    }

    getBackgroundPolyline(): L.Polyline {
        return this.background_polyline;
    }

}