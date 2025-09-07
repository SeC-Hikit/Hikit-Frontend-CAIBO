import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {components} from 'src/binding/Binding';

export type MediaResponse = components["schemas"]["MediaResponse"]
export type Media = components["schemas"]["MediaDto"]


export enum MediaTopic  {
    TRAIL= "TRAIL",
    POI = "POI",
    PLACE = "PLACE",
    ACCESSIBILITY_NOTIFICATION = "ACCESSIBILITY_NOTIFICATION",
    MAINTENANCE = "MAINTENANCE",
    ANNOUNCEMENT = "MAINTENANCE"
}

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    baseUrl = "api/media";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }


    getById(id: String): Observable<MediaResponse> {
        return this.httpClient.get<MediaResponse>(this.baseUrl + "/" + id)
            .pipe(
                tap(),
                catchError(this.handleError<MediaResponse>('get media by id', null))
            );
    }

    get(skip : number, limit: number, realm: string) {
        const params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString());
        if (realm) {
            params.append("realm", realm);
        }
        return this.httpClient.get<MediaResponse>(this.baseUrl ,
            {params: params})
            .pipe(
                tap(),
                catchError(this.handleError<MediaResponse>('get medias', null))
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
