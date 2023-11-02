import { Injectable } from '@angular/core';
import { ApiService } from '../_services/api.service';
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: ApiService) { }

  getCountryData = (filter: any = {}, limit?: number) => {
    console.log('==>>>> getCountryData');
    return this.http.post(ApiService.geturl('country', 'data'), { filter, limit });
  }
}
