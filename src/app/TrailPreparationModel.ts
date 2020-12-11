import { Place } from './Place';
import { TrailCoordinates } from './TrailCoordinates';

export interface TrailPreparationModel {
    name: string,
    description: string,
    startPos: Place,
    finalPos: Place,
    coordinates: TrailCoordinates[],
}