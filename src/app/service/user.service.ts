import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

    public getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiServerUrl}/users`);
    }
}
