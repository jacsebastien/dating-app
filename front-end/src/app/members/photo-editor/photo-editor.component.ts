import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from '../../models/photo.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
    @Input() photos: Photo[];
    @Output() mainPhotoChanged = new EventEmitter<string>();

    private baseUrl = environment.apiUrl;
    private tokenKey = environment.localStorageToken;
    private userId: number;

    mainPhoto: Photo;

    uploader: FileUploader;
    hasBaseDropZoneOver = false;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
        this.userId = this.authService.getDecodedToken().nameid;
        this.initUploader();
    }

    fileOverBase(e: any):void {
        this.hasBaseDropZoneOver = e;
    }

    initUploader(): void {
        this.uploader =  new FileUploader({
            url: `${this.baseUrl}users/${this.userId}/photos`,
            authToken: 'Bearer ' + localStorage.getItem(this.tokenKey),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10*1024*1024 // 10Mb
        });

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const photo: Photo = JSON.parse(response);
                this.photos.push(photo);
                this.alertify.success("Photo uploaded");

                if(photo.isMain) {
                    this.authService.changeMemberPhoto(photo.url);
                }
            }
        };

        this.uploader.onErrorItem = (item, response, status, headers) => {
            if (response) {
                this.alertify.error(response);
            } else {
                this.alertify.error("Trouble happened on photo upload");
            }
        };
    }

    setMainPhoto(photo: Photo): void {
        this.userService.setMainPhoto(this.userId, photo.id)
        .subscribe(() => {
            this.mainPhoto = this.photos.find(photoItem => photoItem.isMain);

            // Switch main properties
            this.mainPhoto.isMain = false;
            photo.isMain = true;

            this.authService.changeMemberPhoto(photo.url);

            this.alertify.success("Photo set to main");
        }, error => {
            this.alertify.error(error);
        });
    }

    deletePhoto(photoId: number): void {
        this.alertify.confirm(
            "Are you sure you want to delete this photo?",
            () => {
                this.userService.deletePhoto(this.userId, photoId)
                .subscribe(() => {
                    this.photos.splice(this.photos.findIndex(photoItem => photoItem.id === photoId), 1);
                    this.alertify.success("Photo has been deleted");
                }, () => {
                    this.alertify.error("Failed to delete photo");
                });
            }
        );
    }
}
