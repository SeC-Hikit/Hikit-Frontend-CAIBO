import { HttpHeaders, HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TrailRawResponse } from './import.service';

@Injectable({
  providedIn: 'root'
})
export class TrailRawService {

  baseUrl = "api/raw";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  get(skip: number, limit: number): Observable<TrailRawResponse> {
    let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
    return this.httpClient.get(this.baseUrl, {params: params})
      .pipe(
        tap(),
        catchError(this.handleError('', null))
      );
  }

  getById(id: string): Observable<TrailRawResponse> {
    return this.httpClient.get(`${this.baseUrl}/${id}`)
      .pipe(
        tap(),
        catchError(this.handleError('', null))
      );
  }

  deleteById(id: string): Observable<TrailRawResponse> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`)
    .pipe(
      catchError(this.handleError('', null))
    )
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
