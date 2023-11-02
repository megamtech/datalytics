import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'formula'
})
@Injectable({ providedIn: 'root' })
export class FormulaPipe implements PipeTransform {

  transform(row: any[], formula: Object, data: any): any {
    // data.forEach((element, index) => {
    //   //TODO Fix checking
    //   if (typeof element[key] == 'undefined') {
    //     element[key] = value;
    //   }
    // });
    let value: any = 0;
    Object.keys(formula).forEach(currentformula => {
      value = this.calculate(value, currentformula, formula[currentformula], row);
    });
    return value;
  }

  calculate(currentValue, currentformula, operends, data) {
    operends.forEach(operend => {
      if (typeof operend === 'object') {
        let currentformula = Object.keys(operend)[0];
        this.calculate(currentValue, currentformula, operend[currentformula], data);
      } else {
        switch (currentformula) {
          case '$div':
            currentValue = operends[0] / operends[1];
            break;
          case '$mul':
            console.log(operends);
            currentValue = currentValue == 0 ? 1 : currentValue;
            operends.map(d => {
              if (d[0] == '$') {
                d = d.replace('$', '')
                console.log(data[d]);
              } else {
                currentValue = d * currentValue
              }
            });
            console.log(currentValue);

            break;
        }
      }
    });
    // } else {

    // }
    console.log(currentValue);
    return currentValue;
  }

}
