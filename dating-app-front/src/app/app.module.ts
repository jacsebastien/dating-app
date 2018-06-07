import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { BsDropdownModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './services/auth.service';
import { AlertifyService } from './services/alertify.service';
import { UserService } from './services/user.service';
import { ErrorsService } from './services/errors.service';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './members/member-card/member-card.component';


@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        ListsComponent,
        MessagesComponent,
        MemberCardComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        AuthService,
        AlertifyService,
        AuthGuard,
        UserService,
        ErrorsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
