import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Group } from 'src/app/types/group'
import { GroupService } from './group.service'
import { UserService } from '../services/user.service'
import { User } from 'src/app/types/user'

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  private group: Group

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GroupService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    this.service.getGroup(id)
      .subscribe((data: Group) => this.group = data)
  }
}
