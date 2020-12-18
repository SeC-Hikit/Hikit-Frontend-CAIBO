import { TrailClassification } from "../TrailClassification";

export class TrailToPolyline {
    
    constructor(private code : string,
        private classification: TrailClassification,
        private polyline: L.Polyline){
    }

    getCode() : string {
        return this.code;
    }

    getClassification(): TrailClassification {
        return this.classification;
    }

    getPolyline() : L.Polyline {
        return this.polyline;
    }


}