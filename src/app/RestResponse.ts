import { Status } from './Status';

export interface RestResponse {
    status: Status,
    messages: string[],
}