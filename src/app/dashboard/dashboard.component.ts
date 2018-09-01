import { Component, OnInit } from '@angular/core'
import { Group } from '../types/group'
import { UserService } from '../services/user.service'
import { Router } from '@angular/router'
import { GroupService } from '../group/group.service'
import { User } from 'src/app/types/user'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private groups: Group[]
  private users: User[]

  constructor(
    private userService: UserService,
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    // Check if the user is logged in
    if (!this.userService.userLoggedIn()) {
      this.router.navigateByUrl('')
      return
    }

    this.groupService
      .getGroups()
      .subscribe((data: Group[]) => (this.groups = data))

    this.userService
      .getUsers()
      .subscribe((data: User[]) => (this.users = data))
  }
}
