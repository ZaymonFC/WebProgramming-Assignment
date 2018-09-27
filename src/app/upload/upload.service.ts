import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private URL = environment.API_URL + '/image'

  constructor(private http: HttpClient) { }

  upload(formData: FormData): any {
    return this.http.post(this.URL, formData)
  }
}

