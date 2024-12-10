import { Routes } from '@angular/router';
import {FileUploadComponent} from './components/fileUpload/file-upload.component';

export const routes: Routes = [
    {
        path: 'file-sharing',
        component: FileUploadComponent,
    }
];
