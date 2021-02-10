import { Place } from './Place';
import { TrailCoordinates } from './TrailCoordinates';

export class PlaceObj implements Place {

    constructor(public name: string,
        public tags: string[],
        public coordinates: TrailCoordinates
    ) { }

}