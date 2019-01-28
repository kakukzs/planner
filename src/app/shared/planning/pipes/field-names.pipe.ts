import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fieldNames'
})
export class FieldNamesPipe implements PipeTransform {

    transform(value: Object): any {
        return Object.keys(value)
            .filter(key => /Field/.test(key))
            .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
            }, {});
    }
}
