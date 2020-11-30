import { Status } from './Status';
import { Trail } from './Trail';

export interface TrailResponse { 
    trails : Trail[],
    status: Status,
    messages: string[]
}