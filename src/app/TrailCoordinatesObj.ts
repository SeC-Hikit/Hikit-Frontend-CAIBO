import { TrailCoordinates } from "./trail-service.service";

export class TrailCoordinatesObj implements TrailCoordinates {
    
    constructor(public latitude: number,
        public longitude: number,
        public altitude: number,
        public distanceFromTrailStart: number
    ) { } 
}