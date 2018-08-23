import { Component, OnInit, Input } from '@angular/core';
import { Group } from 'src/app/types/group';

@Component({
  selector: 'app-dashboard-group',
  templateUrl: './dashboard-group.component.html',
  styleUrls: ['./dashboard-group.component.css']
})
export class DashboardGroupComponent implements OnInit {
  @Input() group: Group
  private collapseClass: string
  private collapsed: boolean

  constructor() {
    this.collapseClass = 'hide'
    this.collapsed = true
  }

  ngOnInit() {
  }

  expand() {
    this.collapseClass = this.collapsed ? 'show' : 'hide'
    this.collapsed = !this.collapsed
  }

}
