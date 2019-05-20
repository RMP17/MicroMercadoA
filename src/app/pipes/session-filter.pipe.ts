import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'sessionFilter' })
export class SessionFilterPipe implements PipeTransform {
    transform(data: any, searchText: any): any {
        if (searchText == null || searchText.length === 0) {
            return data;
        }
        return data.filter(function(item) {
            return item.usuario.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }
}
