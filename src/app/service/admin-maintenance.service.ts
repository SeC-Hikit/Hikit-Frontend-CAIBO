import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {RestResponse} from '../RestResponse';
import {MaintenanceDto} from "./maintenance.service";

@Injectable({
  providedIn: 'root'
})
export class AdminMaintenanceService {
  
  baseUrl = "api/admin/maintenance";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  save(maintenance: MaintenanceDto): Observable<RestResponse> {
    return this.httpClient.put<RestResponse>(this.baseUrl, maintenance)
        .pipe(
            tap(_ => console.log("")),
            catchError(this.handleError<RestResponse>('Save maintenance', null))
        );
  }

  deleteById(_id: any): Observable<RestResponse> {
    return this.httpClient.delete<RestResponse>(this.baseUrl + "/" + _id)
        .pipe(
            tap(_ => console.log("")),
            catchError(this.handleError<RestResponse>('Delete maintenance', null))
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
