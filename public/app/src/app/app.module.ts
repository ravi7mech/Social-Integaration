import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AllUsersComponent,
    UserDetailsComponent,
    UserActivityComponent,
    PageNotFoundComponent,
    AddNewUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
