import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FileInfo} from '../common/file-info';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

    private apiServerUrl = 'http://localhost:8080/files';
    constructor(private http: HttpClient) { }

    getUploadedFiles(): Observable<FileInfo[]> {
        return this.http.get<FileInfo[]>(`${this.apiServerUrl}/list`);
    }

    uploadFile(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.apiServerUrl}/upload`, formData, { responseType: 'text' });
    }

    downloadFile(fileName: string): Observable<Blob> {
        return this.http.get(`${this.apiServerUrl}/${fileName}`, { responseType: 'blob' });
    }

}
