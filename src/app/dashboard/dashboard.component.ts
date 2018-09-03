import { Component, OnInit } from '@angular/core'
import { Group } from '../types/group'
import { UserService } from '../services/user.service'
import { Router } from '@angular/router'
import { GroupService } from '../group/group.service'
import { User } from 'src/app/types/user'
import { PermissionService } from '../services/permission.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private groups: Group[]
  private users: User[]

  private form_groupName = ''
  private form_groupDescription = ''

  private form_username = ''
  private form_email = ''

  constructor(
    private userService: UserService,
    private router: Router,
    private groupService: GroupService,
    private permissions: PermissionService,
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

  createGroup(event: Event) {
    event.preventDefault()
    console.log('Creating Group: ', this.form_groupName, this.form_groupDescription)
    this.groupService.createGroup(this.form_groupName, this.form_groupDescription)
      .subscribe((data: Group) => {
        this.groups.push(data)
        this.form_groupDescription = ''
        this.form_groupName = ''
      })

  }

  removeGroup(id) {
    console.log('Filtering List: ', id)
    this.groups = this.groups.filter(element => element.id !== id)
  }

  createUser(event: Event) {
    event.preventDefault()
    console.log('Creating User: ', this.form_username, this.form_email)
    if (!this.form_email || !this.form_username) { return }

    this.userService.createUser(this.form_username, this.form_email)
      .subscribe((data: User) => {
        this.users.push(data)
        this.form_username = ''
        this.form_email = ''
      })
  }

  removeUser(id) {
    console.log('Filtering User List')
    this.users = this.users.filter(element => element.id !== id)
  }
}
