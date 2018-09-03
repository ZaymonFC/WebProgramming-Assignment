import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Group } from 'src/app/types/group'
import { GroupService } from './group.service'
import { UserService } from '../services/user.service'
import { User } from 'src/app/types/user'
import { ChannelService } from 'src/app/channel/channel.service'
import { Channel } from '../types/channel'
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  private group: Group
  private otherUsers: User[]

  // Form fields
  private form_createChannel: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private channelService: ChannelService,
    private permissions: PermissionService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    this.groupService.getGroup(id)
      .subscribe((data: Group) => {
        this.group = data
        this.groupService.getOtherUsers(this.group.id)
          .subscribe((userData: User[]) => this.otherUsers = userData)
      })

  }

  createChannel(event: Event) {
    event.preventDefault()
    this.channelService.createChannel(this.form_createChannel, this.group.id)
      .subscribe((data: Channel) => this.group.channels.push(data))
    this.form_createChannel = ''
  }

  removeChannel(channelId) {
    console.log(`Deleting Channel ${channelId}`)
    this.channelService.removeChannel(channelId)
      .subscribe((data: any) => console.log(data))

    this.group.channels = this.group.channels.filter(channel => {
      return channel.id !== channelId
    })
  }

  addUser(id) {
    console.log('Adding user to group with id: ', id)
    this.groupService.addUser(id, this.group.id)
      .subscribe((data: any) => {
        const items = this.otherUsers.filter(element => element.id === id)
        const user: User = items.shift()
        this.group.users.push(user)
        this.otherUsers = this.otherUsers.filter(element => element.id !== id)
      })
  }

  removeUser(id) {
    console.log('Removing user from group with id: ', id)
    this.groupService.removeUser(id, this.group.id)
      .subscribe((data: any) => {
        console.log(data)
        const items = this.group.users.filter(e => e.id === id)
        const user: User = items.shift()
        this.otherUsers.push(user)
        this.group.users = this.group.users.filter(element => element.id !== id)
      })
  }

  enterChannel(channelId) {
    this.router.navigate(['/channel', channelId])
  }

  backToDashboard() {
    this.router.navigate(['/dashboard'])
  }

}
