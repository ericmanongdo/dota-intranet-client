import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MyLink} from '../common/my-link';
import {MyLinkCategory} from '../common/my-link-category';

@Injectable({
  providedIn: 'root'
})
export class MyLinkService {

    private apiServerUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){ }

    public getMyLinks(): Observable<MyLink[]> {
        return this.http.get<MyLink[]>(`${this.apiServerUrl}/my-links`);
    }

    public addLink(link: MyLink): Observable<MyLink> {
        return this.http.post<MyLink>(`${this.apiServerUrl}/my-link`, link);
    }

    public updateLink(id: number, link: MyLink): Observable<MyLink> {
        return this.http.put<MyLink>(`${this.apiServerUrl}/my-link/${id}`, link);
    }

    public getCategories(): Observable<MyLinkCategory[]> {
        return this.http.get<MyLinkCategory[]>(`${this.apiServerUrl}/categories`);
    }

    public deleteLink(linkId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/my-link/${linkId}`);
    }

}
