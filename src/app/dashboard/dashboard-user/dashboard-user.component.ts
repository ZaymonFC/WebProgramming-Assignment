import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { User } from 'src/app/types/user'
import { Router } from '@angular/router'
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  @Input() user: User
  @Output() emitter: EventEmitter<string> = new EventEmitter()

  private collapseClass: string
  private collapsed: boolean

  constructor(
    private router: Router,
    private service: UserService,
    private permissions: PermissionService
  ) {
    this.collapseClass = 'hide'
    this.collapsed = true
  }

  ngOnInit() {
  }

  expand() {
    this.collapseClass = this.collapsed ? 'show' : 'hide'
    this.collapsed = !this.collapsed
  }

  userDetail() {
    console.log(this.user._id)
    this.router.navigate(['/user', this.user._id])
  }

  removeUser() {
    this.service.removeUser(this.user._id)
      .subscribe(data => console.log(data))

    this.emitter.emit(this.user._id)
  }

  promoteGroupAdmin() {
    this.changeRank(this.user._id, 'group-admin')
  }

  promoteSuperAdmin() {
    this.changeRank(this.user._id, 'super-admin')
  }

  demoteGroupAdmin() {
    this.changeRank(this.user._id, 'user')
  }

  demoteSuperAdmin() {
    this.changeRank(this.user._id, 'group-admin')
  }

  private changeRank(id: string, rank: string) {
    this.service.changeRank(id, rank)
      .subscribe((data: any) => {
        console.log(data)
        this.user.rank = rank
      })
  }
}
