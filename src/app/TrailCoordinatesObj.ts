import { TrailCoordinates } from './TrailCoordinates'

export class TrailCoordinatesObj implements TrailCoordinates {
    
    constructor(public latitude: number,
        public longitude: number,
        public altitude: number,
        public distanceFromTrailStart: number
    ) { } 
}