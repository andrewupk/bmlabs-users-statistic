import { Component, OnInit } from '@angular/core';
import { UsersdataService } from '../usersdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	constructor(private usersdata: UsersdataService, private router: Router) {  }
	displayedColumns = ['ID', 'First name', 'Last name', 'E-mail', 'Gender', 'IP address', 'Total clicks', 'Total page views'];
	dataSource = [];
	itemslength = 0;
	
	ngOnInit(): void {
		this.usersdata.getUsers(5, 1).subscribe(response => {
			console.log(response);
			this.dataSource = response['users'];
		});
		
		this.usersdata.getUsersCount().subscribe(response => {
			console.log(response);
			this.itemslength = response['length'];
		});
	}
	
	getUser(id){
		console.log(id);
		this.router.navigate(['user', id])
	}
	
	pageChanged(event){
		console.log(event);
		this.usersdata.getUsers(+event.pageSize, +event.pageIndex + 1).subscribe(response => {
			console.log(response);
			this.dataSource = response['users'];
		});
	}
}
