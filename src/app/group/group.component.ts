import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Group } from 'src/app/types/group'
import { GroupService } from './group.service'
import { UserService } from '../services/user.service'
import { User } from 'src/app/types/user'
import { ChannelService } from 'src/app/channel/channel.service'
import { Channel } from '../types/channel'
import { PermissionService } from '../services/permission.service';
import { ChannelSummary } from 'src/app/types/channel-summary';

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
  private showError = false
  private error: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private channelService: ChannelService,
    private permissions: PermissionService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    this.groupService.getGroup(id)
      .subscribe((data: Group) => {
        this.group = data

        // Filter Channels If User
        if (this.userService.getUser().rank === 'user') {
          console.log(this.group.channels, this.userService.getUser()._id)
          if (this.group.channels) {
            this.group.channels = this.group.channels.filter(channel => (
              channel.users.some(user => user === this.userService.getUser()._id)
            ))
          }
        }

        this.groupService.getOtherUsers(this.group._id)
          .subscribe((userData: User[]) => this.otherUsers = userData)
      })

  }

  createChannel(event: Event) {
    event.preventDefault()
    this.channelService.createChannel(this.form_createChannel, this.group._id)
      .subscribe((data: any) => {
        console.log(data)
        if (data.status === 'not-unique') {
          this.showError = true
          this.error = 'Please enter a unique channel name for this group'
        } else {
          this.group.channels.push(data)
          this.showError = false
        }
      })
    this.form_createChannel = ''
  }

  removeChannel(channelId) {
    console.log(`Deleting Channel ${channelId}`)
    this.channelService.removeChannel(channelId)
      .subscribe((data: any) => console.log(data))

    this.group.channels = this.group.channels.filter(channel => {
      return channel._id !== channelId
    })
  }

  addUser(id) {
    console.log('Adding user to group with id: ', id)
    this.groupService.addUser(id, this.group._id)
      .subscribe((data: any) => {
        console.log(data)
        const items = this.otherUsers.filter(element => element._id === id)
        const user: User = items.shift()
        this.group.users.push(user)
        this.otherUsers = this.otherUsers.filter(element => element._id !== id)
      })
  }

  removeUser(id) {
    console.log('Removing user from group with id: ', id)
    this.groupService.removeUser(id, this.group._id)
      .subscribe((data: any) => {
        console.log(data)
        const items = this.group.users.filter(e => e._id === id)
        const user: User = items.shift()
        this.otherUsers.push(user)
        this.group.users = this.group.users.filter(element => element._id !== id)
      })
  }

  enterChannel(channelId) {
    this.router.navigate(['/channel', channelId])
  }

  backToDashboard() {
    this.router.navigate(['/dashboard'])
  }

}
