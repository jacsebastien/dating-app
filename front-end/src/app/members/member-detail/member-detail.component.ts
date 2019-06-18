import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
    user: User;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Use resolver to retrieve user data after route loading
        this.route.data
        .subscribe(data => {
            this.user = data['user'];
        });

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ];

        this.galleryImages = this.getImages();
    }

    getImages(): NgxGalleryImage[] {
        return this.user.photos.map(photo => {
            return {
                small: photo.url,
                medium: photo.url,
                big: photo.url,
                description: photo.description
            };
        });
    }
}
