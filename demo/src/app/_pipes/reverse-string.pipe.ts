import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "reverseString",
})
export class ReverseStringPipe implements PipeTransform {
  transform(value: any, length: number): any {
    if (value != undefined) {
      return value.toString().padStart(length, 0);
    }
  }
}
