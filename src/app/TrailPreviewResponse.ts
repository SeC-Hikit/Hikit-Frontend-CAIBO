import { TrailPreview } from './TrailPreview';
import { Status } from './Status';

export interface TrailPreviewResponse { 
    trailPreviews : TrailPreview[],
    status: Status,
    messages: string[]
}