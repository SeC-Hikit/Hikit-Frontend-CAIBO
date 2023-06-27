import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AdminTrailPreviewService {
    baseUrl = "api/admin/trail-preview";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }


    exportList(realm: string): Observable<any> {
        const params = new HttpParams().set("realm", realm);
        return this.httpClient.post(this.baseUrl +
            "/list/export", {params: params}, {responseType: 'blob'});
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
