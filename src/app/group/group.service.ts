import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';

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
}
