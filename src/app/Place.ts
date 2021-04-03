import { TrailCoordinates } from "./trail-service.service";

export interface Place {
    name: string,
    tags: string[],
    coordinates: TrailCoordinates
    
}