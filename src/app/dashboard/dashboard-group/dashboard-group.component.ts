import { Component, OnInit, Input, Output, EventEmitter, Host } from '@angular/core';
import { Group } from 'src/app/types/group';
import { Router } from '@angular/router';
import { GroupService } from '../../group/group.service';
import { UserService } from '../../services/user.service';
import { DashboardComponent } from '../dashboard.component';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-dashboard-group',
  templateUrl: './dashboard-group.component.html',
  styleUrls: ['./dashboard-group.component.css']
})
export class DashboardGroupComponent implements OnInit {
  @Input() group: Group
  private collapseClass: string
  private collapsed: boolean

  @Output() emitter: EventEmitter<string> = new EventEmitter()

  constructor(
    private router: Router,
    private service: GroupService,
    private userService: UserService,
    private permissions: PermissionService,
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

  groupDetail() {
    console.log(this.group._id)
    this.router.navigate(['/group', this.group._id])
  }

  removeGroup() {
    this.service.removeGroup(this.group._id)
      .subscribe((data: any) => console.log(data))
    this.emitter.emit(this.group._id)
  }

}
