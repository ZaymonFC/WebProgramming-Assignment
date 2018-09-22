import { Component, OnInit } from '@angular/core'
import { ChannelService } from './channel.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Group } from 'src/app/types/group'
import { Channel } from 'src/app/types/channel'
import { GroupService } from '../group/group.service'
import { User } from 'src/app/types/user'
import { PermissionService } from '../services/permission.service'

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  private channel: Channel
  private group: Group
  private otherUsers: User[]

  constructor(
    private route: ActivatedRoute,
    private service: ChannelService,
    private groupService: GroupService,
    private router: Router,
    private permissions: PermissionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    this.service.getChannel(id).subscribe((data: Channel) => {
      this.channel = data
      this.groupService
        .getGroup(this.channel.groupId)
        .subscribe((groupData: Group) => {
          this.group = groupData

          if (this.channel.users.length === 0) {
            this.otherUsers = this.group.users
          } else {
            this.otherUsers = this.group.users.filter(groupUser => {
              return !this.channel.users.some(user => groupUser._id === user._id)
            })
          }
        })
    })
  }

  addUser(id) {
    this.service.addUser(this.channel._id, id).subscribe((data: any) => {
      console.log(data)
      const items = this.otherUsers.filter(element => element._id === id)
      const user = items.shift()
      this.channel.users.push(user)
      this.otherUsers = this.otherUsers.filter(element => element._id !== id)
    })
  }

  removeUser(id) {
    this.service.removeUser(this.channel._id, id).subscribe((data: any) => {
      console.log(data)
      const items = this.channel.users.filter(element => element._id === id)
      this.otherUsers.push(items.shift())
      this.channel.users = this.channel.users.filter(
        element => element._id !== id
      )
    })
  }

  backToGroup(id) {
    this.router.navigate(['/group', id])
  }
}
