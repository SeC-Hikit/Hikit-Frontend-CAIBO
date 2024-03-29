import {TrailClassification} from "./TrailClassification";

export class TrailClassificationUtils {
    static getClassification(classification: String): TrailClassification {
        if (classification == "E") {
            return TrailClassification.E
        }
        if (classification == "T") {
            return TrailClassification.T
        }
        if (classification == "EE") {
            return TrailClassification.EE
        }
        return TrailClassification.EEA;
    }
    static getHighestClassification(classifications: TrailClassification[]) {
        if(classifications.length == 0) return null;
        if(classifications.indexOf(TrailClassification.EEA) != -1) return TrailClassification.EEA;
        if(classifications.indexOf(TrailClassification.EE) != -1) return TrailClassification.EE;
        if(classifications.indexOf(TrailClassification.E) != -1) return TrailClassification.E;
        return TrailClassification.T;
    }
}