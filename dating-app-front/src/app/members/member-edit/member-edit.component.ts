import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { AlertifyService } from '../../services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
    user: User;
    @ViewChild('editForm') editForm: NgForm;

    constructor(
        private route: ActivatedRoute,
        private alertify: AlertifyService
    ) { }

    ngOnInit() {
        this.route.data
        .subscribe(data => {
            this.user = data['user'];
        });
    }

    updateUser(): void {
        console.log(this.user);
        this.alertify.success("Profile updated successfully");
        // reset the form to it's original state and set it's values to edited user values to avoir having blank inputs after reset
        this.editForm.reset(this.user);
    }
}
