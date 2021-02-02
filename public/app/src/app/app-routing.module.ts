import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {path:'allUsers',component:AllUsersComponent},
  {path:'addNewUser',component:AddNewUserComponent},
  {path:'user/:id',component:UserDetailsComponent},
  {path:'',component:AllUsersComponent, pathMatch:'full'},
  {path:'**',component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
