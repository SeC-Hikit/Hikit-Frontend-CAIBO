import { Place } from './Place';
import { TrailCoordinates } from './trail-service.service';

export interface TrailPreparationModel {
    name: string,
    description: string,
    startPos: Place,
    finalPos: Place,
    coordinates: TrailCoordinates[],
}