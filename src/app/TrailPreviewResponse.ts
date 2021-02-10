import { TrailPreview } from './TrailPreview';
import { Status } from './Status';

export interface TrailPreviewResponse { 
    content : TrailPreview[],
    status: Status,
    messages: string[]
}