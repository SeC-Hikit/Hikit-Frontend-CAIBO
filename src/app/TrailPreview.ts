import { Place } from './Place';
import { TrailClassification } from './TrailClassification';

export interface TrailPreview {
    code: string,
    classification: TrailClassification,
    startPos: Place,
    finalPos: Place,
    date: Date
}