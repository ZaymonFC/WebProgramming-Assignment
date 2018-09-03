import { Injectable } from '@angular/core';
import { Channel } from 'src/app/types/channel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
   private routeUrl: string = environment.API_URL + '/channel'

  constructor(
    private http: HttpClient
  ) { }

  createChannel(channelName: string, groupId) {
    console.log(`Creating channel ${channelName} for group ${groupId}`)
    return this.http.put(this.routeUrl, {name: channelName, groupId: groupId})
  }

  removeChannel(channelId: string) {
    return this.http.delete(this.routeUrl + '/' + channelId)
  }

  getChannel(id: string): any {
    return this.http.get(this.routeUrl + '/' + id)
  }

  addUser(channelId: string, userId: string): any {
    return this.http.patch(this.routeUrl, {
      method: 'add-user',
      channelId: channelId,
      userId: userId
    })
  }

  removeUser(channelId: string, userId: string): any {
    return this.http.patch(this.routeUrl, {
      method: 'remove-user',
      channelId: channelId,
      userId: userId
    })
  }
}
