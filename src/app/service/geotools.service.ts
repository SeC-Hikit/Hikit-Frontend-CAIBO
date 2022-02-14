import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {components} from "src/binding/Binding";
import {RestResponse} from "../RestResponse";
import {Coordinates2D} from "./geo-trail-service";
import {CoordinatesDto} from "./trail-service.service";

export type PlaceDto = components["schemas"]["PlaceDto"];
export type PlaceRefDto = components["schemas"]["PlaceRefDto"];
export type PlaceResponse = components["schemas"]["PlaceResponse"];
export type LinkedMedia = components["schemas"]["LinkedMediaDto"];
export type UnlinkMedia = components["schemas"]["UnLinkeMediaRequestDto"];
export type PointGeolocationDto = components["schemas"]["PointGeolocationDto"];

@Injectable({
    providedIn: "root",
})

export class GeoToolsService {
    baseUrl = "api/geo-tool";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {}

    public getAltitude(coordinates : Coordinates2D) : Observable<CoordinatesDto>{
        let params = new HttpParams().set("latitude", coordinates.latitude.toString())
            .append("longitude", coordinates.longitude.toString())
        return this.httpClient.get<CoordinatesDto>(this.baseUrl + "/altitude", {params: params}).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<CoordinatesDto>("", null))
        );
    }

    public getDistance(coordinates : CoordinatesDto[]) : Observable<string> {
        if(coordinates.length == 1) {
            console.error("Need more than one coordinate");
        }
        return this.httpClient.post<any>(this.baseUrl + "/distance", coordinates).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<CoordinatesDto>("", null))
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
