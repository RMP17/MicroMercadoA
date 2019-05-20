import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
    transform(data: any, searchText: any): any {
        if (searchText == null || searchText.length === 0) {
            return data;
        }
        return data.filter(function(item) {
            return item.caja.descripcion.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }
}
