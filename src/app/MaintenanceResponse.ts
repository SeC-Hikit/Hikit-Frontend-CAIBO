import { TrailPreview } from './TrailPreview';
import { Status } from './Status';
import { Maintenance } from './Maintenance';

export interface MaintenanceResponse { 
    maintenanceList : Maintenance[],
    status: Status,
    messages: String[]
}