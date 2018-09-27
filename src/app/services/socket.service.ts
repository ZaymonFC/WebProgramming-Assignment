import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client'
import { Message } from 'src/app/types/message';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://127.0.0.1:4200'
  private socket

  constructor() {
  }

  joinChannel(channel: string, username: string): void {
    this.socket.emit('enter-channel', {
      channel: channel,
      username: username
    })
  }

  sendTextMessage(text: string, channelId: string, userId: string) {
    const message: Message = {
      text: text,
      channelId: channelId,
      userId: userId,
      type: 'text',
      timeStamp: Date.now(),
      image: null
    }
    this.socket.emit('add-message', message)
  }

  sendImageMessage(imagePath: string, channelId: string, userId: string): void {
    const message: Message = {
      text: null,
      channelId: channelId,
      userId: userId,
      type: 'image',
      timeStamp: Date.now(),
      image: imagePath
    }
    console.log(imagePath)
    this.socket.emit('add-message', message)
  }

  getMessages() {
    const obMessages = new Observable(observer => {
        this.socket = io()

        // Listen for the new-message event from the server
        this.socket.on('message', data => observer.next(data))

        // When the observer ends (unsubscribes) then disconnect from the socket
        return () => { this.socket.disconnect() }
      }
    )

    return obMessages
  }

}
