import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestResponse } from './RestResponse';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  baseUrl = "api/admin/test";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  test() {
    return this.httpClient.get<RestResponse>(this.baseUrl)
  }

}
