import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {components} from 'src/binding/Binding';
import {TrailMappingResponse} from "./trail-service.service";

export type TrailPreviewResponse = components["schemas"]["TrailPreviewResponse"];
export type TrailPreview = components["schemas"]["TrailPreviewDto"];

@Injectable({
    providedIn: 'root'
})
export class TrailPreviewService {

    baseUrl = "api/preview";
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(private httpClient: HttpClient) {
    }

    findByCode(code: string, skip: number, limit: number, realm?: string, areDraftsVisible: boolean = true): Observable<TrailPreviewResponse> {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
            .append("isDraftTrailVisible", String(areDraftsVisible))
        if (code == "") {
            return this.getPreviews(skip, limit, realm, areDraftsVisible);
        }
        if (realm) {
            params.append("realm", realm);
        }
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl + "/find/code/" + code, {params: params})
            .pipe(
                catchError(this.handleError<TrailPreviewResponse>('find previews by code', null))
            );
    }

    findTrailByNameOrLocationsNames(name: String, realm: string,
                                    areDraftsVisible: boolean,
                                    skip: number, limit: number): Observable<TrailPreviewResponse> {
        let params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
            .append("isDraftTrailVisible", String(areDraftsVisible))
        if (realm) {
            params.append("realm", realm);
        }
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl + "/find/name/" + name,
            {params: params})
            .pipe(
                tap(),
                catchError(this.handleError<TrailPreviewResponse>('get trail', null))
            );
    }

    getPreview(id: string): Observable<TrailPreviewResponse> {
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl + "/" + id)
            .pipe(
                tap(_ => console.log(_)),
                catchError(this.handleError<TrailPreviewResponse>('get preview', null))
            );
    }

    findByMunicipality(municipalityName: string, realm: string,
                       areDraftsVisible: boolean,
                       skip: number, limit: number): Observable<TrailPreviewResponse> {
        const params = new HttpParams().set("skip", skip.toString()).append("limit", limit.toString())
            .append("isDraftTrailVisible", String(areDraftsVisible))
        if (realm) {
            params.append("realm", realm);
        }
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl + "/find/municipality/" + municipalityName,
            {params: params})
            .pipe(
                tap(_ => console.log(_)),
                catchError(this.handleError<TrailPreviewResponse>('get preview', null))
            );
    }

    getPreviews(skip: number, limit: number, realm?: string, areDraftsVisible: boolean = true): Observable<TrailPreviewResponse> {
        let params = new HttpParams().set("skip", skip.toString())
            .append("limit", limit.toString())
            .append("realm", realm ? realm : "*")
            .append("isDraftTrailVisible", String(areDraftsVisible));
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl, {params: params})
            .pipe(
                tap(_ => console.log(_)),
                catchError(this.handleError<TrailPreviewResponse>('get all previews', null))
            );
    }

    getRawPreviews(skip: number, limit: number, realm?: string): Observable<TrailPreviewResponse> {
        let params = new HttpParams().set("skip", skip.toString())
            .append("limit", limit.toString());
        if (realm) {
            params = params.append("realm", realm);
        }
        return this.httpClient.get<TrailPreviewResponse>(this.baseUrl + "/raw", {params: params})
            .pipe(
                tap(_ => console.log(_)),
                catchError(this.handleError<TrailPreviewResponse>('get all previews', null))
            );
    }

    getMappings(realm: string, limit = "500"): Observable<TrailMappingResponse> {
        let params = new HttpParams().set("realm", realm)
            .append("isDraftTrailVisible", String(true))
            .append("limit", limit);
        return this.httpClient.get<TrailMappingResponse>(this.baseUrl + "/map", {params: params})
            .pipe(
                tap(_ => console.log(_)),
                catchError(this.handleError<TrailMappingResponse>('get preview', null))
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
