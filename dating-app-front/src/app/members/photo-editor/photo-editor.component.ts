import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from '../../models/photo.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
    @Input() photos: Photo[];
    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    baseUrl = environment.apiUrl;
    tokenKey = environment.localStorageToken;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.initUploader();
    }

    fileOverBase(e: any):void {
        this.hasBaseDropZoneOver = e;
    }

    initUploader(): void {
        this.uploader =  new FileUploader({
            url: `${this.baseUrl}users/${this.authService.getDecodedToken().nameid}/photos`,
            authToken: 'Bearer ' + localStorage.getItem(this.tokenKey),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10*1024*1024 // 10Mb
        });

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const res: Photo = JSON.parse(response);
                this.photos.push(res);
            }
        };
    }
}
