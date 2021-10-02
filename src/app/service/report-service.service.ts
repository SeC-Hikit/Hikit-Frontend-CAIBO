import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestResponse } from '../RestResponse';
import { components } from 'src/binding/Binding';

export type AccessibilityReportResponse = components["schemas"]["AccessibilityReportResponse"]
export type AccessibilityReport = components["schemas"]["AccessibilityReportDto"]

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  baseUrl = "api/report";
  baseAdminUrl = "api/admin/report";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  create(report : AccessibilityReport) {
    return this.httpClient.post<AccessibilityReportResponse>(this.baseAdminUrl, report)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('create report', null))
      );
  }

  delete(id : string) {
    return this.httpClient.delete<AccessibilityReportResponse>(this.baseAdminUrl + "/" + id)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('delete report', null))
      );
  }

  upgrade(report : AccessibilityReport) {
    return this.httpClient.post<AccessibilityReportResponse>(this.baseAdminUrl + "/upgrade", report)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('create report', null))
      );
  }


  update(report : AccessibilityReport) {
    return this.httpClient.put<AccessibilityReportResponse>(this.baseAdminUrl, report)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('update report', null))
      );
  }

  getById(id: String): Observable<AccessibilityReportResponse> {
    return this.httpClient.get<AccessibilityReportResponse>(this.baseUrl + "/" + id)
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('get report by id', null))
      );
  }

  getUnapgradedByRealm(skip: number, limit: number, realm: string): Observable<AccessibilityReportResponse> {
    let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
    return this.httpClient.get<AccessibilityReportResponse>(this.baseUrl + "/not-upgraded/" + realm, {params: params})
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('get not upgraded report', null))
      );
  }

  getByTrailId(skip: number, limit: number, trailId: string): Observable<AccessibilityReportResponse> {
    let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
    return this.httpClient.get<AccessibilityReportResponse>(this.baseUrl + "/trail" + trailId, {params: params})
      .pipe(
        tap(),
        catchError(this.handleError<AccessibilityReportResponse>('get not upgraded report', null))
      );
  }

  deleteById(_id: string): Observable<RestResponse> {
    return this.httpClient.delete<RestResponse>(this.baseUrl + "/" + _id)
      .pipe(
        tap(),
        catchError(this.handleError<RestResponse>('delete by id', null))
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
