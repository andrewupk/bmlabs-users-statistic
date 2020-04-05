import { Injectable } from '@angular/core';
import { HttpClientJsonpModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersdataService {

	constructor(private http: HttpClient) { }
	
	public getUsers(count, page){
		return this.http.jsonp('http://127.0.0.1:3000/users?count=' + count + '&page=' + page, 'callback');
	}
	
	public getUsersCount(){
		return this.http.jsonp('http://127.0.0.1:3000/userscount', 'callback');
	}
	
	public getUserStatistic(id, timeFrom=0, timeTo=0){
		return this.http.jsonp('http://127.0.0.1:3000/user/' + id + '?timeFrom=' + timeFrom + '&timeTo=' + timeTo, 'callback');
	}
}
