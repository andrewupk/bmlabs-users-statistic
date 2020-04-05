import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserStatisticComponent } from './user-statistic/user-statistic.component';
 
const routes: Routes = [
	{path: '', redirectTo: '/users', pathMatch: 'full'},
	{path: 'users', component: UsersComponent},
	{path: 'user/:id', component: UserStatisticComponent}	
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
