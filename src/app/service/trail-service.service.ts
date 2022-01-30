import {HttpHeaders, HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {components} from 'src/binding/Binding';

export type TrailResponse = components["schemas"]["TrailResponse"]
export type TrailCoordinatesDto = components["schemas"]["TrailCoordinatesDto"]
export type CoordinatesDto = components["schemas"]["CoordinatesDto"]
export type TrailDto = components["schemas"]["TrailDto"]
export type FileDetailsDto = components["schemas"]["TrailDto"]["fileDetails"]

export enum TrailClassification {
    T = "T",
    E = "E",
    EE = "EE",
    EEA = "EEA"
}

@Injectable({
    providedIn: 'root'
})
export class TrailService {

    baseUrl = "api/trail";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }


    getTrailById(id: String): Observable<TrailResponse> {
        return this.httpClient.get<TrailResponse>(this.baseUrl + "/" + id)
            .pipe(
                tap(),
                catchError(this.handleError<TrailResponse>('get trail', null))
            );
    }

    deleteByCode(code: string): Observable<TrailResponse> {
        return this.httpClient.delete<TrailResponse>(this.baseUrl + "/" + code)
            .pipe(
                tap(),
                catchError(this.handleError<TrailResponse>('get all trail', null))
            );
    }

    downloadGpx(code: string): any {
        return this.httpClient.get(this.baseUrl + "/file/gpx/" + code + ".gpx", {responseType: 'blob'})
            .pipe(tap(),
                catchError(this.handleError<HttpResponse<Blob>>('get trail resource URL', null))
            );
    }

    downloadKml(code: string): any {
        return this.httpClient.get(this.baseUrl + "/file/kml/" + code + ".kml", {responseType: 'blob'})
            .pipe(tap(),
                catchError(this.handleError<HttpResponse<Blob>>('get trail resource URL', null))
            );
    }

    downloadPdf(code: string): any {
        return this.httpClient.get(this.baseUrl + "/file/pdf/" + code + ".pdf", {responseType: 'blob'})
            .pipe(tap(),
                catchError(this.handleError<HttpResponse<Blob>>('get trail resource URL', null))
            );
    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
