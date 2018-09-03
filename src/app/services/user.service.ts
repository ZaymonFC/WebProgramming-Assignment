import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedIn: boolean
  private user: User
  private url = environment.API_URL + '/user'

  constructor(private http: HttpClient) { }

  logInUser(username): void {

    this.http.get(environment.API_URL + '/login/' + username)
    .subscribe((response: User) => {
      if (response != null) {
        this.initSession(response)
      }
    },
    (err) => {
      console.error(err)
    })
  }

  initSession(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user))
    this.user = user
    this.loggedIn = true
  }

  logOutUser(): void {
    if (!this.loggedIn) { return }

    this.cleanSession()
    this.loggedIn = false
  }

  userLoggedIn (): boolean {
    return this.user != null
  }

  getUser(): User {
    return this.user
  }


  getUsers() {
    return this.http.get(environment.API_URL + '/user')
  }

  private cleanSession(): void {
    sessionStorage.removeItem('user')
    this.user = null
  }

  createUser(username: string, email: string): Observable<Object> {
    return this.http.post(this.url, {
      username: username,
      email: email
    })
  }

  removeUser(id: string): any {
    return this.http.delete(this.url + '/' + id)
  }

  changeRank(id: string, rank: string): any {
    return this.http.patch(this.url + '/' + id, {
      rank: rank
    })
  }
}
