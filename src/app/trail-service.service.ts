import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RestResponse } from './RestResponse';
import { TrailResponse } from './TrailResponse';

@Injectable({
  providedIn: 'root'
})
export class TrailService {

  baseUrl = "api/trail";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getTrailByCode(code: String): Observable<TrailResponse> {
    return this.httpClient.get<TrailResponse>(this.baseUrl + "/" + code + "?light=true")
      .pipe(
        tap(),
        catchError(this.handleError<TrailResponse>('get all trail', null))
      );
  }

  getTrailsLight() : Observable<TrailResponse> {
    return this.httpClient.get<TrailResponse>(this.baseUrl + "/?light=true")
      .pipe(
        tap(),
        catchError(this.handleError<TrailResponse>('get all trail', null))
      );
  }

  deleteByCode(code: string) : Observable<RestResponse>{
    return this.httpClient.delete<TrailResponse>(this.baseUrl + "/" + code)
      .pipe(
        tap(),
        catchError(this.handleError<TrailResponse>('get all trail', null))
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
