import { Place } from './Place';
import { TrailCoordinatesObj } from './TrailCoordinatesObj';

export class PlaceObj implements Place {

    constructor(public name: string,
        public tags: string[],
        public coordinates: TrailCoordinatesObj
    ) { }

}