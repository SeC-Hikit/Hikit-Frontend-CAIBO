import { Place } from './Place';
import { TrailClassification } from './TrailClassification';
import { TrailCoordinates } from './TrailCoordinates';

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