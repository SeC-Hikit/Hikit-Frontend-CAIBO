import { RestResponse } from "./RestResponse";

export interface FileDownloadResponse extends RestResponse { 
    path: string
}