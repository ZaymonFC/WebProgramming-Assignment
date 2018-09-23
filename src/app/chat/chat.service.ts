import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from 'src/app/types/message';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = environment.API_URL + '/chat/'

  constructor(
    private http: HttpClient
  ) { }


  getMessages(channelId: string): Observable<Object> {
    return this.http.get(this.url + channelId)
  }
}
