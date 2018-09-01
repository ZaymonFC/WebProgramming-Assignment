import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() title: string
  private loggedIn: boolean
  private user: User
  private routeName: string

  constructor(private router: Router, private userService: UserService) {
    // Subscribe to route changes to re-evalutate logged in status
    router.events.subscribe(() => {
      this.loggedIn = userService.userLoggedIn()
      if (this.userService.userLoggedIn()) {
        this.user = userService.getUser()
      }
    })
  }

  ngOnInit() {
  }

  logOut(event: Event) {
    this.userService.logOutUser()
    this.router.navigateByUrl('')
    this.loggedIn = false
    this.user = null
  }
}
