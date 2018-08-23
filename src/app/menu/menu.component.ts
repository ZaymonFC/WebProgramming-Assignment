import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private loggedIn: boolean
  private username: string
  private routeName: string

  constructor(private router: Router, private userService: UserService) {
    // Subscribe to route changes to re-evalutate logged in status
    router.events.subscribe(() => {
      this.loggedIn = userService.userLoggedIn()
      if (this.userService.userLoggedIn()) {
        this.username = userService.getUser().username
      }
    })
  }

  ngOnInit() {
  }

  logOut(event: Event) {
    this.userService.logOutUser()
    this.router.navigateByUrl('')
    this.loggedIn = false
    this.username = null
  }
}
