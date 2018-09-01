import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private username: string
  private showError: boolean
  private statusMessage: string
  private loggedIn: boolean

  constructor(
    private router: Router,
    private form: FormsModule,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.username = ''
    this.showError = false
    this.statusMessage = ''
  }

  ngOnInit() {
    this.loggedIn = this.userService.userLoggedIn()
  }

  loginUser(event: Event) {
    event.preventDefault()
    if (this.username === '') {
      this.showError = true
      this.statusMessage = 'Please ensure username field is not blank'
      return
    }

    this.userService.logInUser(this.username)

    if (this.userService.userLoggedIn()) {
      this.router.navigateByUrl('dashboard')
    } else {
      this.statusMessage = 'That user does not exist on the server'
      this.showError = true
    }
  }
}

