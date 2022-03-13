import { HttpHeaders, HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { components } from 'src/binding/Binding';
import { TrailResponse } from './trail-service.service';

export type TrailIntersectionResponse = components["schemas"]["TrailIntersectionResponse"];
export type TrailIntersection = components["schemas"]["TrailIntersectionDto"];
export type GeoLine = components["schemas"]["GeoLineDto"];
export type RectangleDto = components["schemas"]["RectangleDto"];
export type Coordinates2D = components["schemas"]["Coordinates2D"];

@Injectable({
  providedIn: 'root'
})
export class GeoTrailService {

  baseUrl = "api/geo-trail";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  intersect(geoLine: GeoLine): Observable<TrailIntersectionResponse> {
    return this.httpClient.post<TrailIntersectionResponse>(this.baseUrl + "/intersect", geoLine)
      .pipe(
        tap(),
        catchError(this.handleError<TrailIntersectionResponse>('', null))
      );
  }

  locate(rectangle: RectangleDto, level: string = "MEDIUM",
         areDraftVisible: boolean = true): Observable<TrailResponse> {
    let params = new HttpParams().set("level", level)
        .append("isDraftTrailVisible", String(areDraftVisible))
    return this.httpClient.post<TrailResponse>(this.baseUrl + "/locate", rectangle, {params: params})
      .pipe(
        tap(),
        catchError(this.handleError<TrailResponse>('', null))
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
