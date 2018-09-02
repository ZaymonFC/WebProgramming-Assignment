import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Group } from 'src/app/types/group'
import { GroupService } from './group.service'
import { UserService } from '../services/user.service'
import { User } from 'src/app/types/user'
import { ChannelService } from 'src/app/channel/channel.service';
import { Channel } from '../types/channel';

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
    private service: GroupService,
    private channelService: ChannelService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')

    this.service.getGroup(id)
      .subscribe((data: Group) => {
        this.group = data
        this.service.getOtherUsers(this.group.id)
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
    this.service.addUser(id, this.group.id)
      .subscribe((data: any) => {
        const items = this.otherUsers.filter(element => element.id === id)
        const user: User = items.shift()
        this.group.users.push(user)
        this.otherUsers = this.otherUsers.filter(element => element.id !== id)
      })
  }

  removeUser(id) {
    console.log('Removing user from group with id: ', id)
    this.service.removeUser(id, this.group.id)
      .subscribe((data: any) => {
        console.log(data)
        const items = this.group.users.filter(e => e.id === id)
        const user: User = items.shift()
        this.otherUsers.push(user)
        this.group.users = this.group.users.filter(element => element.id !== id)
      })
  }

}
