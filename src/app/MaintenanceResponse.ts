import { TrailPreview } from './TrailPreview';
import { Status } from './Status';
import { Maintenance } from './Maintenance';

export interface MaintenanceResponse { 
    content : Maintenance[],
    status: Status,
    messages: String[]
}