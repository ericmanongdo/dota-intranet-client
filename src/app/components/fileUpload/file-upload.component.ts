import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FileUploadService} from '../../service/file-upload.service';
import {FileInfo} from '../../common/file-info';

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [
        FormsModule,
        DecimalPipe,
        RouterLink,
        NgForOf
    ],
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss', '../myLink/my-link.component.scss']
})
export class FileUploadComponent implements OnInit {
    selectedFile: File | null = null;
    fileList: FileInfo[] = [];
    uploadStatus: string = '';

    constructor(private fileUploadService: FileUploadService) {}

    ngOnInit(): void {
        this.fetchFiles();
    }

    fetchFiles(): void {
        this.fileUploadService.getUploadedFiles().subscribe({
            next: (files) => {
                this.fileList = files;
            },
            error: (err) => {
                console.error('Error fetching files:', err);
            },
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            this.uploadStatus = 'No file selected.';
            return;
        }

        this.fileUploadService.uploadFile(this.selectedFile).subscribe({
            next: (response) => {
                this.uploadStatus = `File uploaded successfully: ${response}`;
                this.fetchFiles(); // Refresh the file list after upload
            },
            error: (err) => {
                this.uploadStatus = `Error uploading file: ${err.message}`;
            },
        });
    }

    downloadFile(file: FileInfo): void {
        this.fileUploadService.downloadFile(file.name).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading file:', err);
            },
        });
    }

}
