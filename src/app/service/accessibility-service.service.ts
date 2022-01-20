import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestResponse } from '../RestResponse';
import { components } from 'src/binding/Binding';
import {AccessibilityReport} from "./report-service.service";

export type AccessibilityNotificationResponse = components["schemas"]["AccessibilityResponse"]
export type AccessibilityNotificationDto = components["schemas"]["AccessibilityNotificationDto"]
export type AccessibilityResolutionResponseDto = components["schemas"]["AccessibilityNotificationResolutionDto"]

@Injectable({
  providedIn: 'root'
})
export class AccessibilityNotificationService {
  
  baseUrl = "api/accessibility";
  baseAdminUrl = "api/admin/accessibility";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getUnresolved() {
    return this.httpClient.get<AccessibilityNotificationResponse>(this.baseUrl + "/unresolved")
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('get unresolved notification', null))
      );
  }

  getUnresolvedByTrailId(id: string): Observable<AccessibilityNotificationResponse> {
    return this.httpClient.delete<AccessibilityNotificationResponse>(this.baseUrl + "/" + id)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityNotificationResponse>('delete by id', null))
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
