import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'arrayfill'
})
@Injectable({ providedIn: 'root' })
export class ArrayFillfilterPipe implements PipeTransform {

  transform(data: any[], key: string, value: any): any {
    data.forEach((element, index) => {
      //TODO Fix checking
      if (typeof element[key] == 'undefined') {
        element[key] = value;
      }
    });
    return data;
  }

}
