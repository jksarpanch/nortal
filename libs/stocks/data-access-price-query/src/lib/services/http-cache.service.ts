import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private request: any ={};

  constructor() {}

  put(url: string, response: HttpResponse<any>): void {
    this.request[url] = response;
  }

  get(url: string): HttpResponse<any> | undefined {
    return this.request[url];
  }
  //Will help me remove individual item from cache
  invalidateUrl(url: string): void {
    this.request[url] = undefined;
  }
  // remove cache
  invalidateCache(): void {
    this.request= {};
  }


}
