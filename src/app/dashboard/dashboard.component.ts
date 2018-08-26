import { Component, OnInit } from '@angular/core';
import { Group } from '../types/group';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { getDummyGroups } from './mockData'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private groups: Group[]

  constructor
  (
    private userService: UserService,
    private router: Router,
  ) {
    this.groups = getDummyGroups()
  }

  ngOnInit() {
    // Check if the user is logged in
    if (!this.userService.userLoggedIn()) {
      this.router.navigateByUrl('')
      return
    }
    // this.groups = getDummyGroups()
  }

}
