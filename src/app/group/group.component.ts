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
      .subscribe((data: Group) => this.group = data)
  }

  createChannel(event: Event) {
    event.preventDefault()
    this.channelService.createChannel(this.form_createChannel, this.group.id)
      .subscribe((data: Channel) => this.group.channels.push(data))
  }

  removeChannel(channelId) {
    this.channelService.removeChannel(channelId, this.group.id)
  }
}
