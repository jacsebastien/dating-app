import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './guards/auth.guard';

import { MemberDetailResolver } from './resolvers/member-detail-resolver.service';
import { MemberListResolver } from './resolvers/member-list-resolver.service';
import { MemberEditResolver } from './resolvers/member-edit-resolver.service';

import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    // Create a dummy route containing all protected routes
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver} },
            { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
            { path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver} },
            { path: 'messages', component: MessagesComponent },
            { path: 'lists', component: ListsComponent },
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
