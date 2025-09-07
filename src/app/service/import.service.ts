import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {components} from "src/binding/Binding";
import {RestResponse} from "../RestResponse";
import {TrailMappingResponse, TrailResponse} from "./trail-service.service";
import {MediaResponse} from "./media-service.service";


export type TrailRawResponse = components['schemas']['TrailRawResponse'];
export type TrailImportRequest = components['schemas']['TrailImportDto'];
export type TrailRawDto = components['schemas']['TrailRawDto'];

@Injectable({
  providedIn: "root",
})
export class ImportService {
  trailImport = "api/admin/import";
  mediaImport = "api/admin/media";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private httpClient: HttpClient) { }

  readTrail(file: File): Observable<TrailRawResponse> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.httpClient
      .post<TrailRawResponse>(this.trailImport, formData)
      .pipe(
        catchError(this.handleError<TrailRawResponse>("Read file", null))
      );
  }

  uploadImage(file: File) : Observable<MediaResponse> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.httpClient
        .post<MediaResponse>(this.mediaImport, formData)
        .pipe(
            catchError(this.handleError<TrailRawResponse>("Upload image file", null))
        );
  }

  readTrails(files: FileList): Observable<TrailRawResponse> {
    const formData: FormData = new FormData();
    for (let index = 0; index < files.length; index++) {
      formData.append("files", files[index], files[index].name)

    }
    return this.httpClient
      .post<TrailRawResponse>(this.trailImport + "/bulk", formData)
      .pipe(
        catchError(this.handleError<TrailRawResponse>("bulk files", null))
      );
  }

  saveTrail(trailImportRequest: TrailImportRequest): Observable<TrailResponse> {
    return this.httpClient
      .put<RestResponse>(this.trailImport + "/save", trailImportRequest)
      .pipe(
        tap((_) => console.log("")),
        catchError(this.handleError<RestResponse>("get all trail", null))
      );
  }

  checkTrail(trailDto: TrailRawDto) : Observable<TrailMappingResponse> {
    return this.httpClient
        .post(this.trailImport + "/check", trailDto)
        .pipe(
            tap((_) => console.log("")),
            catchError(this.handleError<RestResponse>("get trail", null))
        );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
