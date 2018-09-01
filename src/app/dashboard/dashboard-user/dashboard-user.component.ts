import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/types/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  @Input() user: User
  private collapseClass: string
  private collapsed: boolean

  constructor(private router: Router) {
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
    console.log(this.user.id)
    this.router.navigate(['/user', this.user.id])
  }
}
