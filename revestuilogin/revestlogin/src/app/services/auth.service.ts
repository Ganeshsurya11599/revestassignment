import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseURL: any = environment.apiURL;
  details: any;
  headers: any;

  constructor(private http: HttpClient) { }

  login(payload: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseURL + 'login', payload).subscribe(res => {
        resolve(res);
      })
    })
  }

  allUsers(payload: any) {
    return new Promise((resolve, reject) => {
      this.details = JSON.parse(localStorage.getItem('userdetails') || '');
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.details.token
      });
      this.http.get(this.baseURL + 'allusers', { headers: this.headers }).subscribe(res => {
        resolve(res);
      })
    })
  }

  createUser(payload: any) {
    return new Promise((resolve, reject) => {
      this.details = JSON.parse(localStorage.getItem('userdetails') || '');
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.details.token
      });
      this.http.post(this.baseURL + 'createuser', payload, { headers: this.headers }).subscribe(res => {
        resolve(res);
      })
    })
  }

  getUserDetails() {
    let details = JSON.parse(localStorage.getItem('userdetails') || '');
    return (details !== null) ? details : {};
  }

  updateUserActiveStatus(payload:any){
    return new Promise((resolve, reject) => {
      this.details = JSON.parse(localStorage.getItem('userdetails') || '');
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.details.token
      });
      this.http.post(this.baseURL + 'updateactive', payload, { headers: this.headers }).subscribe(res => {
        resolve(res);
      })
    })
  }

  get isLoggedIn(): boolean {
    let authToken = JSON.parse(localStorage.getItem('userdetails') || '');
    return (authToken !== null) ? true : false;
  }

}
