import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestResponse } from '../RestResponse';
import {
  AccessibilityNotification,
  AccessibilityNotificationResolution,
  AccessibilityNotificationResponse
} from "./notification-service.service";

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {
  
  baseUrl = "api/admin/report";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  upgrade(id: string) {
    return this.httpClient.put<RestResponse>(this.baseUrl + "/upgrade/" + id, null)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('upgrade report', null))
      );
  }

  delete(id: string) {
    return this.httpClient.delete<RestResponse>(this.baseUrl + "/upgrade/" + id)
        .pipe(
            tap(),
            catchError(this.handleError<AccessibilityNotificationResponse>('delete report', null))
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
