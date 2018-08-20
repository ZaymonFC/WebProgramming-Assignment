import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private username: string
  private showError: boolean
  private statusMessage: string

  constructor(private router: Router, private form: FormsModule, private http: HttpClient) {
    this.username = ''
    this.showError = false
    this.statusMessage = ''
  }

  ngOnInit() {
    if (window.sessionStorage) {
      if (sessionStorage.getItem('loggedIn')) {
        this.router.navigateByUrl('chat')
      }
    }
  }

  loginUser(event: Event) {
    event.preventDefault()
    if (this.username === '') {
      this.showError = true
      this.statusMessage = 'Please ensure username field is not blank'
      return
    }

    if (window.sessionStorage) {
      console.log(`Logging user: ${this.username} into local storage `)
      sessionStorage.setItem('username', this.username)
      sessionStorage.setItem('loggedIn', 'true')
      this.router.navigateByUrl('chat')
    }
  }

}
