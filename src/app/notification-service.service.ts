import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestResponse } from './RestResponse';
import { components } from 'src/binding/Binding';

export type AccessibilityNotificationResponse = components["schemas"]["AccessibilityResponse"]
export type AccessibilityNotificationResolution = components["schemas"]["AccessibilityNotificationResolutionDto"]
export type AccessibilityNotification = components["schemas"]["AccessibilityNotificationDto"]
export type AccessibilityNotificationCreation = components["schemas"]["AccessibilityNotificationCreationDto"]

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  baseUrl = "api/accessibility";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  createNotification(notification : AccessibilityNotification) {
    return this.httpClient.put<RestResponse>(this.baseUrl, notification)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('create trail', null))
      );
  }

  getUnresolvedByTrailByCode(code: String): Observable<AccessibilityNotificationResponse> {
    return this.httpClient.get<AccessibilityNotificationResponse>(this.baseUrl + "/unresolved/" + code)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('get unresolved by trail', null))
      );
  }

  getUnresolved(): Observable<AccessibilityNotificationResponse> {
    return this.httpClient.get<AccessibilityNotificationResponse>(this.baseUrl + "/unresolved")
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('get all unresolved', null))
      );
  }

  getAllResolved(): Observable<AccessibilityNotificationResponse> {
    return this.httpClient.get<AccessibilityNotificationResponse>(this.baseUrl + "/solved")
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('get all resolved', null))
      );
  }

  deleteById(_id: string): Observable<RestResponse> {
    return this.httpClient.delete<RestResponse>(this.baseUrl + "/" + _id)
      .pipe(
        tap(),
        catchError(this.handleError<RestResponse>('delete by id', null))
      );
  }

  resolveNotification(resolution: AccessibilityNotificationResolution): Observable<RestResponse> {
    return this.httpClient.post<RestResponse>(this.baseUrl + "/resolve", resolution)
    .pipe(
      tap(),
      catchError(this.handleError<RestResponse>('', null))
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
