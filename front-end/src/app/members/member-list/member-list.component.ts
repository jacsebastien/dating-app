import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../environments/environment';

import { User } from '../../models/user.model';
import { Pagination, PaginatedResult } from '../../models/pagination.model';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
    users: User[];
    user: User = JSON.parse(localStorage.getItem(environment.localStorageUser));
    genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
    userParams: any = {};

    pagination: Pagination;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
        // Use resolver to retrieve user data after route loading
        this.route.data
        .subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });

        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.orderBy = 'lastActive';
    }

    pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }

    resetFilters() {
        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.orderBy = 'lastActive';

        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
        .subscribe((res: PaginatedResult<User[]>) => {
            this.users = res.result;
            this.pagination = res.pagination;
        }, error => {
            this.alertify.error(error);
        });
    }
}
