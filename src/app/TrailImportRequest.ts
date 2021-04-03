import { Place } from './Place';
import { TrailCoordinates } from './trail-service.service';
import { TrailClassification } from './TrailClassification';

export class TrailImportRequest {
    constructor(
        public name: string,
        public code: string,
        public description: string,
        public classification: TrailClassification,
        public startPos: Place,
        public finalPos: Place,
        public lastUpdate: Date,
        public locations: Place[],
        public maintainingSection: string,
        public coordinates: TrailCoordinates[]) { }
}