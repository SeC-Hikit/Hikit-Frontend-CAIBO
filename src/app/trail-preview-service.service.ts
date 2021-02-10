import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TrailPreview } from './TrailPreview';
import { catchError, map, tap } from 'rxjs/operators';
import { TrailPreviewResponse } from './TrailPreviewResponse';


@Injectable({
  providedIn: 'root'
})
export class TrailPreviewService {

  baseUrl = "api/preview";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getPreviews(): Observable<TrailPreviewResponse> {
    return this.httpClient.get<TrailPreviewResponse>(this.baseUrl)
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError<TrailPreviewResponse>('get all previews', null))
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
