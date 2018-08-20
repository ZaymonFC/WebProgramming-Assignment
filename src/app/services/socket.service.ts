import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://127.0.0.1:4200'
  private socket

  constructor() {
  }

  sendMessage(message) {
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
