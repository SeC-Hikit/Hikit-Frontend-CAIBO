import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {components} from "src/binding/Binding";

export type PlaceResponse = components["schemas"]["PlaceResponse"];
export type LinkedMedia = components["schemas"]["LinkedMediaDto"];
export type UnlinkMedia = components["schemas"]["UnLinkeMediaRequestDto"];
export type PointGeolocationDto = components["schemas"]["PointGeolocationDto"];

@Injectable({
    providedIn: "root",
})

export class CrosswayService {
    baseUrl = "api/crossway";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {
    }

    get(skip: number, limit: number, realm: string): Observable<PlaceResponse> {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
        if (realm) { params = params.append("realm", realm); }
        return this.httpClient.get<PlaceResponse>(this.baseUrl, {params: params}).pipe(
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
    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
