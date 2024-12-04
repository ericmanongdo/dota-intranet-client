import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Headline} from '../common/headline';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeadlineService {

    private apiServerUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){ }

    public getHeadlines(): Observable<Headline[]> {
        return this.http.get<Headline[]>(`${this.apiServerUrl}/headlines`);
    }

    public addHeadline(headline: Headline): Observable<Headline> {
        return this.http.post<Headline>(`${this.apiServerUrl}/headline`, headline);
    }

    public updateHeadline(id: number, headline: Headline): Observable<Headline> {
        return this.http.put<Headline>(`${this.apiServerUrl}/headline/${id}`, headline);
    }

}
