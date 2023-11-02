import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], filterKey: string, filterValue: string): any {
        if (!items || !filterKey) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        console.log(items.filter(item => item[filterKey] === filterValue));
        return items.filter(item => item[filterKey] === filterValue);
    }
}