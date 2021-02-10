import { Place } from "./Place";
import { TrailCoordinates } from "./TrailCoordinates";

export interface AccessibilityNotification { 
    _id: string,
    code: string,
    description: string,
    reportDate: Date,
    resolutionDate: Date,
    isMinor: boolean,
    resolution: string
    coordinates: TrailCoordinates
}