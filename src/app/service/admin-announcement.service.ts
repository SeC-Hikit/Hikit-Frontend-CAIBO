import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {components} from 'src/binding/Binding';
import {EnumValue} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import {PlaceDto, PlaceResponse} from "./place.service";
import {RestResponse} from "../RestResponse";

export type AnnouncementDto = components["schemas"]["AnnouncementDto"]
export type AnnouncementResponse = components["schemas"]["AnnouncementResponse"]
export type AnnouncementType = components["schemas"]["AnnouncementDto"]["type"]

@Injectable({
    providedIn: 'root'
})
export class AdminAnnouncementService {
    baseUrl = "api/admin/announcement";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }


    create(announcement: AnnouncementDto): Observable<PlaceResponse> {
        return this.httpClient.put<AnnouncementResponse>(this.baseUrl, announcement).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<PlaceResponse>("Create announcement", null))
        );
    }

    update(announcement: AnnouncementDto): Observable<AnnouncementResponse> {
        return this.httpClient.post<RestResponse>(this.baseUrl, announcement).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<RestResponse>("Update announcement", null))
        );
    }

    deleteById(_id: string): Observable<PlaceResponse> {
        return this.httpClient.delete<AnnouncementResponse>(this.baseUrl + "/" + _id).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<PlaceResponse>("", null))
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
