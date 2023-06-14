import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {components} from 'src/binding/Binding';

export type AnnouncementDto = components["schemas"]["AnnouncementDto"]
export type AnnouncementResponse = components["schemas"]["AnnouncementResponse"]
export type AnnouncementType = components["schemas"]["AnnouncementDto"]["type"]

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    baseUrl = "api/announcement";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }


    getAnnouncements(skip: number,
                     limit: number, realm: string): Observable<AnnouncementResponse> {
        const params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
            .append("realm", realm)
        return this.httpClient.get<AnnouncementResponse>(this.baseUrl, {params: params})
            .pipe(
                tap(),
                catchError(this.handleError<AnnouncementResponse>('Get announcement', null))
            );
    }

    getAnnouncementById(id: String): Observable<AnnouncementResponse> {
        return this.httpClient.get<AnnouncementResponse>(this.baseUrl + "/" + id)
            .pipe(
                tap(),
                catchError(this.handleError<AnnouncementResponse>('Get announcement', null))
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
