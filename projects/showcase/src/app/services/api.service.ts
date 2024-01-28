import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  rootPath = 'http://127.0.0.1:5000/inner/v1/company';

  constructor(
    private http: HttpClient
  ) { }

  get(path: string) {
    const urlPath = `${this.rootPath}${path}`
    return this.http.get<any>(urlPath)
  }

  post(path: string, data: any = {}) {
    const urlPath = `${this.rootPath}${path}`
    return this.http.post<any>(urlPath, data)
  }
}
