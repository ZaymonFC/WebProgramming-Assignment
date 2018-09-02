import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { User } from 'src/app/types/user';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private url: string

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.API_URL + '/group'
  }

  getGroups() {
    return this.http.get(this.url)
  }

  getGroup(id: string) {
    return this.http.get(this.url + '/' + id)
  }

  createGroup(name: string, description: string): Observable<object> {
    const group = {
      name: name,
      description: description,
    }
    return this.http.post(this.url, group)
  }

  removeGroup(id: string): Observable<object> {
    console.log('Deleting :', id)
    return this.http.delete(this.url + '/' + id)
  }

  // Function to return list of users that aren't in this group
  getOtherUsers(id: string): Observable<object> {
    console.log('Fetching users not in group: ', id)
    return this.http.get(environment.API_URL + '/otherUsers/' + id)
  }

  removeUser(id: string, groupId: string): Observable<object> {
    return this.http.patch(environment.API_URL + '/group/' + groupId + '/user', {
      method: 'remove-user',
      id: id
    })
  }

  addUser(id: string, groupId: string): Observable<object> {
    return this.http.patch(environment.API_URL + '/group/' + groupId + '/user/', {
      method: 'add-user',
      id: id
    })
  }
}
