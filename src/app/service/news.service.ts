import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {News} from '../common/news';
import {NewsCategory} from '../common/news-category';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
    private apiServerUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){ }

    public getNews(): Observable<News[]> {
        return this.http.get<News[]>(`${this.apiServerUrl}/news`);
    }

    public getCategories(): Observable<NewsCategory[]> {
        return this.http.get<NewsCategory[]>(`${this.apiServerUrl}/news-categories`);
    }

    public addNews(news: News): Observable<News> {
        return this.http.post<News>(`${this.apiServerUrl}/news`, news);
    }

    public updateNews(id: number, news: News): Observable<News> {
        return this.http.put<News>(`${this.apiServerUrl}/news/${id}`, news);
    }

    public deleteNews(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/news/${id}`);
    }

}
