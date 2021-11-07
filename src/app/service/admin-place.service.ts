import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { components } from "src/binding/Binding";
import { RestResponse } from "../RestResponse";
import {TrailDto, TrailResponse} from "./trail-service.service";
import {TrailImportRequest} from "./import.service";
import {LinkedMedia, PlaceDto, PlaceResponse, UnlinkMedia} from "./place.service";

export type TrailImportDto = components['schemas']['TrailImportDto'];

@Injectable({
  providedIn: "root",
})
export class AdminPlaceService {
  baseUrl = "api/admin/place";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private httpClient: HttpClient) { }

  create(place: PlaceDto): Observable<PlaceResponse> {
    return this.httpClient.put<PlaceResponse>(this.baseUrl, place).pipe(
        tap((_) => console.log("")),
        catchError(this.handleError<PlaceResponse>("Save maintenance", null))
    );
  }

  update(place: PlaceDto): Observable<PlaceResponse> {
    return this.httpClient.post<RestResponse>(this.baseUrl, place).pipe(
        tap((_) => console.log("")),
        catchError(this.handleError<RestResponse>("Save maintenance", null))
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
            catchError(this.handleError<PlaceResponse>("Save maintenance", null))
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
