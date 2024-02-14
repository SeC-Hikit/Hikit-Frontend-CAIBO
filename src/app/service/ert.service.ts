import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {components} from "src/binding/Binding";

export type LocalityResponse = components["schemas"]["LocalityResponse"]
export type LocalityDto = components["schemas"]["LocalityDto"]
export type EventResponse = components["schemas"]["EventResponse"]
export type EventDto = components["schemas"]["EventDto"]

@Injectable({
    providedIn: "root",
})

export class ErtService {
    localitiesBaseUrl = "api/ert/localities";
    eventsBaseUrl = "api/ert/events";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {
    }

    getLocalityDetailsByIstat(istat: String): Observable<LocalityResponse> {
        return this.httpClient.get<LocalityResponse>(this.localitiesBaseUrl + "/" + istat).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<LocalityResponse>("", null))
        );
    }

    getEventsByIstat(istat: String, skip: number, limit: number): Observable<EventResponse> {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
        return this.httpClient.get<EventResponse>(this.eventsBaseUrl + "/" + istat, {params})
            .pipe(
                catchError(this.handleError<EventResponse>("", null))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
