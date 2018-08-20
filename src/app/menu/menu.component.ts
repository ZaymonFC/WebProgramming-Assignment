import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private loggedIn: boolean
  private username: string

  constructor(private router: Router) {
    // Subscribe to route changes to re-evalutate logged in status
    router.events.subscribe(() => {
      if (window.sessionStorage) {
        if (sessionStorage.getItem('loggedIn')) {
          this.loggedIn = true
          this.username = sessionStorage.getItem('username')
        } else {
          this.loggedIn = false
        }
      }
    })
  }

  ngOnInit() {
  }

  logOut(event: Event) {
    if (window.sessionStorage) {
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('loggedIn')
    }

    this.router.navigateByUrl('')

    this.loggedIn = false
  }

}
