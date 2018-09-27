import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { SocketService } from '../services/socket.service'
import { Subscription } from 'rxjs'
import { UserService } from '../services/user.service'
import { Channel } from 'src/app/types/channel'
import { Message } from 'src/app/types/message'
import { ChatService } from './chat.service'
import { UploadService } from '../upload/upload.service'

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

  private selectedFile = null

  @Input()
  private channel: Channel

  @ViewChild('fileInput')
  private fileInput

  constructor(
    private router: Router,
    private socketService: SocketService,
    private userService: UserService,
    private chatService: ChatService,
    private uploadService: UploadService
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
    this.chatService
      .getMessages(this.channel._id)
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
    this.selectedFile = null
  }

  onFileSelected(event) {
    console.log(event)
    this.selectedFile = event.target.files[0]
    console.log(event.target.files)
  }

  onUpload() {
    const formData = new FormData()
    formData.append('image', this.selectedFile, this.selectedFile.name)
    this.uploadService.upload(formData).subscribe((response: any) => {
      console.log(response)
      if (response.image) {
        const imagePath = response.image
        this.socketService.sendImageMessage(
          imagePath,
          this.channel._id,
          this.userId
        )
        this.selectedFile = null
        this.fileInput.nativeElement.value = ''
      }
    })
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
