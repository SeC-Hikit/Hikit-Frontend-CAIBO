import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {components} from 'src/binding/Binding';

export type PoiResponse = components["schemas"]["PoiResponse"];
export type PoiDto = components["schemas"]["PoiDto"];
export type KeyValueDto = components["schemas"]["KeyValueDto"];

@Injectable({
  providedIn: 'root'
})
export class PoiService {

  baseUrl = "api/poi";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  get(skip: number, limit: number, realm?: string): Observable<PoiResponse> {
    let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
    if (realm) { params = params.append("realm", realm); }
    return this.httpClient.get<PoiResponse>(this.baseUrl, { params: params })
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<PoiResponse>('get all POI', null))
      );
  }

  getById(id: string): Observable<PoiResponse> {
    return this.httpClient.get<PoiResponse>(this.baseUrl + "/" + id)
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<PoiResponse>('get ID: ' + id, null))
      );
  }

  getByTrailCode(id: string): Observable<PoiResponse> {
    return this.httpClient.get<PoiResponse>(this.baseUrl + "/trail/" + id)
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<PoiResponse>('get by trail ID: ' + id, null))
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
