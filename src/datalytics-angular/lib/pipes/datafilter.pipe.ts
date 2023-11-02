import { Pipe, PipeTransform } from '@angular/core';
import { Column } from '../models/column';
import { Injectable } from '@angular/core';
@Pipe({
  name: 'datafilter'
})

@Injectable({ providedIn: 'root' })
export class DatafilterPipe implements PipeTransform {

  transform(data: Column[], key: string, value?: any): any {

    const isNotCondition = key[0] === '!' ? true : false;
    const propertyName = isNotCondition ? key.substring(1) : key;
    return data.filter(obj => {
      if (isNotCondition) {
        return obj[propertyName] !== value && typeof obj[propertyName] !== 'undefined' ? true : false;
      } else {
        return obj[propertyName] === value ? true : false;
      }

    });

  }

}
