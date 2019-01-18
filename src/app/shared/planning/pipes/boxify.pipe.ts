import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boxify'
})
export class BoxifyPipe implements PipeTransform {

  transform(value: any, length: number = 10): any {
    return value <= length ? value : `<span title="${value}">${value.substr(0, length)}&hellip;</span>`
  }
}
