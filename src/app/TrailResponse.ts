import { Status } from './Status';
import { Trail } from './Trail';

export interface TrailResponse { 
    content : Trail[],
    status: Status,
    messages: string[]
}