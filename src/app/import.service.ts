import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RestResponse } from './RestResponse';
import { TrailImportRequest } from './TrailImportRequest';
import { TrailPreparationModel } from './TrailPreparationModel';
import { TrailResponse } from './TrailResponse';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  baseUrl = "api/import";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  readTrail(file: File): Observable<TrailPreparationModel> {
    const formData: FormData = new FormData();
    formData.append('gpxFile', file);
    return this.httpClient.post<TrailPreparationModel>(this.baseUrl + "/read", formData)
      .pipe(
        tap(_ => console.log("")),
        catchError(this.handleError<TrailPreparationModel>('Read file', null))
      );
  }

  saveTrail(trailImportRequest: TrailImportRequest): Observable<RestResponse> {
    return this.httpClient.put<RestResponse>(this.baseUrl + "/save", trailImportRequest)
      .pipe(
        tap(_ => console.log("")),
        catchError(this.handleError<RestResponse>('get all trail', null))
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
