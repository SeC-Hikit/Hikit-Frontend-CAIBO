import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { components } from "src/binding/Binding";
import { RestResponse } from "../RestResponse";
import {TrailDto, TrailResponse} from "./trail-service.service";

export type TrailImportDto = components['schemas']['TrailImportDto'];

@Injectable({
  providedIn: "root",
})
export class AdminTrailService {
  baseUrl = "api/admin/trail";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private httpClient: HttpClient) { }

  saveTrail(trailImportRequest: TrailImportDto): Observable<TrailResponse> {
    return this.httpClient
      .put<RestResponse>(this.baseUrl + "/save", trailImportRequest)
      .pipe(
        tap((_) => console.log("")),
        catchError(this.handleError<RestResponse>("get all trail", null))
      );
  }

  deleteTrail(trailImportRequest: TrailImportDto): Observable<TrailResponse> {
    return this.httpClient
        .put<RestResponse>(this.baseUrl + "/save", trailImportRequest)
        .pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<RestResponse>("get all trail", null))
        );
  }

  deleteById(id: string): Observable<TrailResponse> {
    return this.httpClient.delete<TrailResponse>(this.baseUrl + "/" + id)
        .pipe(
            tap(),
            catchError(this.handleError<TrailResponse>('get all trail', null))
        );
  }

  updateTrail(trailDto: TrailDto): Observable<TrailResponse> {
    return this.httpClient
        .put<RestResponse>(this.baseUrl + "/update", trailDto)
        .pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<RestResponse>("update trail", null))
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
