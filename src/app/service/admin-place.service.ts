import {HttpHeaders, HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {components} from "src/binding/Binding";
import {RestResponse} from "../RestResponse";
import {CoordinatesDto, TrailDto, TrailResponse} from "./trail-service.service";
import {TrailImportRequest} from "./import.service";
import {LinkedMedia, PlaceDto, PlaceRefDto, PlaceResponse, UnlinkMedia} from "./place.service";
import {RecordDetailsDto} from "./auth.service";

export type LinkedPlaceDto = components['schemas']['LinkedPlaceDto'];

@Injectable({
    providedIn: "root",
})
export class AdminPlaceService {
    baseUrl = "api/admin/place";
    httpOptions = {
        headers: new HttpHeaders({"Content-Type": "application/json"}),
    };

    constructor(private httpClient: HttpClient) {
    }

    create(place: PlaceDto): Observable<PlaceResponse> {
        return this.httpClient.put<PlaceResponse>(this.baseUrl, place).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<PlaceResponse>("Create place", null))
        );
    }

    update(place: PlaceDto): Observable<PlaceResponse> {
        return this.httpClient.post<RestResponse>(this.baseUrl, place).pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<RestResponse>("Update place", null))
        );
    }

    addMedia(
        placeId: String,
        linkedMedia: LinkedMedia
    ): Observable<PlaceResponse> {
        return this.httpClient
            .put<PlaceResponse>(this.baseUrl + "/" + placeId, linkedMedia)
            .pipe(
                tap((_) => console.log("")),
                catchError(this.handleError<PlaceResponse>("Add media", null))
            );
    }

    linkTrail(linkedPlaceDto: LinkedPlaceDto) : Observable<PlaceResponse> {
        return this.httpClient
            .put<PlaceResponse>(this.baseUrl + "/link/trail", linkedPlaceDto)
            .pipe(
                tap((_) => console.log("")),
                catchError(this.handleError<PlaceResponse>("Link trail", null))
            );
    }

    unlinkTrail(linkedPlaceDto: LinkedPlaceDto) : Observable<PlaceResponse> {
        return this.httpClient
            .put<PlaceResponse>(this.baseUrl + "/unlink/trail", linkedPlaceDto)
            .pipe(
                tap((_) => console.log("")),
                catchError(this.handleError<PlaceResponse>("Unlink trail", null))
            );
    }

    removeMedia(
        placeId: String,
        linkedMedia: UnlinkMedia
    ): Observable<PlaceResponse> {
        return this.httpClient
            .post<PlaceResponse>(this.baseUrl + "/" + placeId, linkedMedia)
            .pipe(
                tap((_) => console.log("")),
                catchError(this.handleError<PlaceResponse>("", null))
            );
    }

    deleteById(_id: any): Observable<PlaceResponse> {
        return this.httpClient.delete<PlaceResponse>(this.baseUrl + "/" + _id).pipe(
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
