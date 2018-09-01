import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private url: string

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.API_URL
  }

  getGroups() {
    return this.http.get(this.url + '/group')
  }

  getGroup(id: string) {
    return this.http.get(this.url + `/group/${id}`)
  }
}
