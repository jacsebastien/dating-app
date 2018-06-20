import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './services/auth.service';
import { AlertifyService } from './services/alertify.service';
import { UserService } from './services/user.service';
import { ErrorsService } from './services/errors.service';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditResolver } from './resolvers/member-edit.resolver';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { environment } from '../environments/environment';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';

export function tokenGetter() {
    return localStorage.getItem(environment.localStorageToken);
  }

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        ListsComponent,
        MessagesComponent,
        MemberCardComponent,
        MemberDetailComponent,
        MemberEditComponent,
        MemberEditComponent,
        PhotoEditorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        JwtModule.forRoot({
            config: {
              tokenGetter: tokenGetter,
              whitelistedDomains: [environment.apiDomain],
              blacklistedRoutes: [environment.apiUrl + 'auth/']
            }
        }),
        NgxGalleryModule
    ],
    providers: [
        AuthService,
        AlertifyService,
        AuthGuard,
        UserService,
        ErrorsService,
        MemberDetailResolver,
        MemberListResolver,
        MemberEditResolver,
        PreventUnsavedChangesGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
