import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'centavos' })
export class CentavosPipe implements PipeTransform {
    transform(num): any {
        return (Math.round(num * 100)) - (Math.floor(num) * 100);
    }
}
