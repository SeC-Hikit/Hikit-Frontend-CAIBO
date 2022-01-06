import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {components} from "src/binding/Binding";
import {RestResponse} from "../RestResponse";

export type PlaceDto = components["schemas"]["PlaceDto"];
export type PlaceRefDto = components["schemas"]["PlaceRefDto"];
export type PlaceResponse = components["schemas"]["PlaceResponse"];
export type LinkedMedia = components["schemas"]["LinkedMediaDto"];
export type UnlinkMedia = components["schemas"]["UnLinkeMediaRequestDto"];
export type PointGeolocationDto = components["schemas"]["PointGeolocationDto"];

@Injectable({
    providedIn: "root",
})

export class PlaceService {
    baseUrl = "api/place";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {
    }

    get(skip: number, limit: number): Observable<PlaceResponse> {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
        return this.httpClient.get<PlaceResponse>(this.baseUrl, {params: params}).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<PlaceResponse>("", null))
        );
    }

    getById(id: string): Observable<PlaceResponse> {
        return this.httpClient.get<PlaceResponse>(this.baseUrl + "/" + id).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<PlaceResponse>("", null))
        );
    }

    getLikeNameOrTags(name: string, skip: number, limit: number) {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
        return this.httpClient
            .get<PlaceResponse>(this.baseUrl + "/name/" + name, {params: params})
            .pipe(
                tap((_) => console.log("")),
                catchError(this.handleError<PlaceResponse>("", null))
            );
    }

    geoLocatePlace(
        pointGeoLocationCoordinates: PointGeolocationDto,
        skip: number,
        limit: number
    ) {
        let params = new HttpParams()
            .set("skip", skip.toString())
            .append("limit", limit.toString());
        return this.httpClient.post<PlaceResponse>(
            this.baseUrl + "/geolocate",
            pointGeoLocationCoordinates,
            {params: params}
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
