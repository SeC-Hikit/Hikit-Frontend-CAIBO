import { Place } from './Place';
import { StatsMetadata } from './StatsMetadata';
import { TrailClassification } from './TrailClassification';
import { TrailCoordinates } from './TrailCoordinates';

export interface Trail {
    name: String,
    code: String,
    description: String,
    classification: TrailClassification,
    startPos: Place,
    finalPos: Place,
    country: String,
    statsMetadata: StatsMetadata,
    lastUpdate: Date,
    maintainingSection: String,
    coordinates: TrailCoordinates[],
    locations: Place[],
}