import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {components} from 'src/binding/Binding';

export type CustomItineraryResult = components["schemas"]["CustomItineraryResultDto"]
export type CustomItineraryRequest = components["schemas"]["CustomItineraryRequestDto"]
@Injectable({
  providedIn: 'root'
})
export class CustomItineraryService {
  
  baseUrl = "api/custom-itinerary";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  constructItinerary(plan: CustomItineraryRequest) {
    return this.httpClient.post<CustomItineraryResult>(this.baseUrl + "/construct", plan)
      .pipe(
        tap(),
        catchError(this.handleError<CustomItineraryResult>('Construct a custom itinerary', null))
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
