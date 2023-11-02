import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';

import { ConstantService } from '../_config/constants';

@Injectable()
export class ApiService {
  data: any;
  result: any;
  httpEvent: HttpEvent<Event>;

  static geturl(url) {
    const apiurl = url;
    if (typeof url === 'undefined') {
      return '';
    }
    return ConstantService.BASE_URL + '/' + apiurl;
  }
  constructor(public http: HttpClient) { }
  get(url: string, data: any = {}) {
    url = url.replace(/:([^\/]+)/g, (_, key) => {
      return (typeof data[key] !== 'undefined') ? data[key] : '';
    });
    return this.http.get(url);
  }
  delete(url: string, data: any = {}) {
    url = url.replace(/:([^\/]+)/g, (_, key) => {
      return (typeof data[key] !== 'undefined') ? data[key] : '';
    });
    return this.http.delete(url);
  }


  post(url: string, data: any = {}, options: any = {}) {
    this.data = data;
    // check for Regex patterns
    url = url.replace(/:([^\/]+)/g, (_, key) => {
      return (typeof data[key] !== 'undefined') ? data[key] : '';
    });
    if (Object.keys(options).length === 0) {
      return this.http.post(url, this.data);
    } else {
      return this.http.post(url, this.data, options);
    }
  }

  put(url: string, data: any = {}, replace_params: any = {}) {
    this.data = data;
    // check for Regex patterns
    url = url.replace(/:([^\/]+)/g, (_, key) => {
      return (typeof replace_params[key] !== 'undefined') ? replace_params[key] : '';
    });

    return this.http.put(url, this.data);
  }

  downloadFile(url: string, application_accept_type: string = 'application/text') {
    window.location.href = url;
  }
  uploadFile(url: string, files: File[], data: any) {

    const mFormData: FormData = new FormData();
    files.forEach((file, index) =>
      mFormData.append('file', file)
    );
    console.log('data in upload', mFormData);
    // Object.keys(data).forEach((key) => {
    // this.appendFormdata(mFormData, data, '');
    mFormData.append("data", JSON.stringify(data));
    // });
    url = url.replace(/:([^\/]+)/g, (_, key) => {
      return (typeof data[key] !== 'undefined') ? data[key] : '';
    });
    const config = new HttpRequest<any>('POST', url, files, {
      reportProgress: true
      // , responseType: 'text'
    });
    return this.http.post(url, mFormData);
  }

  appendFormdata(FormData: FormData, data: any, name: string) {
    name = name || '';
    console.log('data', name, typeof data);
    if (typeof data === 'object') {
      Object.keys(data).forEach((key, index) => {
        if (name === '') {
          this.appendFormdata(FormData, data[key], key);
        } else {
          this.appendFormdata(FormData, data[key], name + '[' + key + ']');
        }
      });
    } else {
      FormData.append(name, data);
    }
  }
  getImageUrl(path: string) {
    return ConstantService.IMG_BASE_URL + path;
  }
}
