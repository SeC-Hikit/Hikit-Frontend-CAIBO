import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {PoiDto, PoiResponse} from "./poi-service.service";


@Injectable({
  providedIn: 'root'
})
export class AdminPoiService {

  baseUrl = "api/admin/poi";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) {
  }

  getByTrailCode(id: string): Observable<PoiResponse> {
    return this.httpClient.get<PoiResponse>(this.baseUrl + "/code" + id)
        .pipe(
            tap(_ => console.log(_)),
            catchError(this.handleError<PoiResponse>('get by trail ID: ' + id, null))
        );
  }

  create(poi: PoiDto) {
    return this.httpClient.post<PoiResponse>(this.baseUrl, poi)
        .pipe(
            tap(_ => console.log(_)),
            catchError(this.handleError<PoiResponse>('Creating poi', null))
        );
  }

  delete(id: string) {
    return this.httpClient.delete<PoiResponse>(this.baseUrl + "/" + id)
        .pipe(
            tap(_ => console.log(_)),
            catchError(this.handleError<PoiResponse>('Delete POI', null))
        );
  }

  update(poi: PoiDto) {
    return this.httpClient.put<PoiResponse>(this.baseUrl, poi)
        .pipe(
            tap(_ => console.log(_)),
            catchError(this.handleError<PoiResponse>('Updating poi', null))
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

