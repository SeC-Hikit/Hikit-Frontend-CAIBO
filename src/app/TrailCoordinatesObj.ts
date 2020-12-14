import { TrailCoordinates } from './TrailCoordinates'

export class TrailCoordinatesObj implements TrailCoordinates {

    public values = [];

    constructor(public latitude: number,
        public longitude: number,
        public altitude: number,
        public distanceFromTrailStart: number
    ){
        this.values=[longitude, latitude];
    }
}