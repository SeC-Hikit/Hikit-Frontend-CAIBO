import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {components} from "src/binding/Binding";

export type MunicipalityResponse = components["schemas"]["MunicipalityResponse"]
export type Municipality = components["schemas"]["MunicipalityDetailsDto"]

@Injectable({
    providedIn: "root",
})

export class MunicipalityService {
    baseUrl = "api/municipality";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {
    }

    get(): Observable<MunicipalityResponse> {
        return this.httpClient.get<MunicipalityResponse>(this.baseUrl).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<MunicipalityResponse>("", null))
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
