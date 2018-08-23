import { Injectable } from '@angular/core';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedIn: boolean
  private user: User

  constructor() { }

  logInUser(username): void {
    const user = {
      username: username,
      type: null
    }
    sessionStorage.setItem('user', JSON.stringify(user))
    this.loggedIn = true
  }

  logOutUser(): void {
    if (!this.loggedIn) { return }

    this.cleanSession()
    this.loggedIn = false
  }

  userLoggedIn (): boolean {
    this.updateUserInformation()
    return this.loggedIn
  }

  getUser(): User {
    return this.user
  }

  private updateUserInformation(): void {
    if (!sessionStorage.getItem('user')) {
      this.loggedIn = false
      this.cleanSession()
    } else {
      const user = JSON.parse(sessionStorage.getItem('user'))
      this.loggedIn = true
      this.user = {
        username: user.username,
        userType: user.type
      }
    }
  }

  private cleanSession(): void {
    sessionStorage.removeItem('user')
    this.user = null
  }
}
