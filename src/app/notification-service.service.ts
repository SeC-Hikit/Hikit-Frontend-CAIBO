import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccessibilityNotificationUnresolvedResponse } from './AccessibilityNotificationUnresolvedResponse';
import { AccessibilityNotificationResponse } from './AccessibilityNotificationResolvedResponse';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  baseUrl = "api/accessibility";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getUnresolvedByTrailByCode(code: String): Observable<AccessibilityNotificationUnresolvedResponse> {
    return this.httpClient.get<AccessibilityNotificationUnresolvedResponse>(this.baseUrl + "/unresolved/" + code)
      .pipe(
        tap(_ => console.log("")),
        catchError(this.handleError<AccessibilityNotificationUnresolvedResponse>('get unresolved by trail', null))
      );
  }

  getUnresolved(): Observable<AccessibilityNotificationUnresolvedResponse> {
    return this.httpClient.get<AccessibilityNotificationUnresolvedResponse>(this.baseUrl + "/unresolved")
      .pipe(
        tap(_ => console.log("")),
        catchError(this.handleError<AccessibilityNotificationUnresolvedResponse>('get all unresolved', null))
      );
  }

  getAllResolved() {
    return this.httpClient.get<AccessibilityNotificationResponse>(this.baseUrl + "/solved")
      .pipe(
        tap(_ => console.log("")),
        catchError(this.handleError<AccessibilityNotificationResponse>('get all resolved', null))
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
