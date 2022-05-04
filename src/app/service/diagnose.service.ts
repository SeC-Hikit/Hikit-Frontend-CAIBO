import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {components} from "../../binding/Binding";

export type DiagnoseResponse = components["schemas"]["DiagnoseResponse"]

@Injectable({
  providedIn: 'root'
})
export class AdminDiagnoseService {

  baseUrl = "api/admin/diagnose";
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private httpClient: HttpClient) {
  }

  testAltitude(): Observable<DiagnoseResponse> {
    return this.httpClient.get<DiagnoseResponse>(this.baseUrl + "/altitude")
        .pipe(
            tap(_ => console.log("")),
            catchError(this.handleError<DiagnoseResponse>('Diagnose the altitude service', null))
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
