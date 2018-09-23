import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router } from '@angular/router'
import { SocketService } from '../services/socket.service'
import { Subscription } from 'rxjs'
import { UserService } from '../services/user.service'
import { Channel } from 'src/app/types/channel'
import { Message } from 'src/app/types/message'
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private messages
  private message
  private connection: Subscription

  private username: string
  private userId: string

  @Input()
  private channel: Channel

  constructor(
    private router: Router,
    private socketService: SocketService,
    private userService: UserService,
    private chatService: ChatService
  ) {
    // Check if the user is logged in
    if (!this.userService.userLoggedIn()) {
      this.router.navigateByUrl('')
      return
    }

    console.log('[Chat] accessing username')
    this.username = this.userService.getUser().username
    this.userId = this.userService.getUser()._id
    this.message = ''
    this.messages = []
  }

  ngOnInit() {
    console.log('Connecting to socket service')
    this.chatService.getMessages(this.channel._id)
      .subscribe((data: Message[]) => {
        this.messages = data
      })

    this.connection = this.socketService
      .getMessages()
      .subscribe((message: Message) => {
        this.messages.push(message)
      })

    this.socketService.joinChannel(this.channel._id, this.username)
  }

  sendTextMessage() {
    console.log(this.message)
    this.socketService.sendTextMessage(
      `[${this.username}] - ${this.message}`,
      this.channel._id,
      this.userId
    )
    this.message = ''
  }

  keyUp(key: any) {
    if (key === 'Enter') {
      this.sendTextMessage()
    }
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe()
    }
  }
}
