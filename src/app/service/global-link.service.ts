import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalLink} from '../common/global-link';
import {GlobalLinkCategory} from '../common/global-link-category';

@Injectable({
    providedIn: 'root'
})
export class GlobalLinkService {

    constructor(private readonly http: HttpClient) {}

    private readonly apiServerUrl = 'http://localhost:8080';

    public getGlobalLinks(): Observable<GlobalLink[]> {
        return this.http.get<GlobalLink[]>(`${this.apiServerUrl}/global-links`);
    }

    public getGlobalLinkCategories(): Observable<GlobalLinkCategory[]> {
        return this.http.get<GlobalLinkCategory[]>(`${this.apiServerUrl}/global-categories`);
    }

    public addGlobalLink(globalLink: GlobalLink): Observable<GlobalLink> {
        return this.http.post<GlobalLink>(`${this.apiServerUrl}/global-link`, globalLink);
    }

    public updateGlobalLink(id: number, globalLink: GlobalLink): Observable<GlobalLink> {
        return this.http.put<GlobalLink>(`${this.apiServerUrl}/global-link/${id}`, globalLink);
    }

    public deleteGlobalLink(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/global-link/${id}`);
    }
}
