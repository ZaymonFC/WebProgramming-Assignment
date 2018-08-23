import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { SocketService } from '../services/socket.service';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private username = ''
  private messages
  private message
  private connection: Subscription

  constructor(
    private router: Router,
    private socketService: SocketService,
    private userService: UserService
  ) {

    // Check if the user is logged in
    if (!this.userService.userLoggedIn()) {
      this.router.navigateByUrl('')
      return
    }

    console.log('[Chat] accessing username')
    this.username = this.userService.getUser().username
    this.message = ''
    this.messages = []
  }

  ngOnInit() {
    console.log('Connecting to socket service');
    this.connection = this.socketService.getMessages()
      .subscribe(message => {
        this.messages.push(message)
        this.message = '';
      })
  }

  sendMessage() {
    console.log(this.message)
    this.socketService.sendMessage(`[${this.username}] - ${this.message}`)
  }

  keyUp(key: any) {
    if (key === 'Enter') {
      this.sendMessage()
    }
  }

  ngOnDestroy() {
    if (this.connection) {
      this.connection.unsubscribe()
    }
  }

}
