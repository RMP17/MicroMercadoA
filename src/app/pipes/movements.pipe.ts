import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'movementFilter' })
export class MovementPipe implements PipeTransform {
    transform(movements: any, searchText: any): any {
        if (searchText == null || searchText.length === 0) {
            return movements;
        }
        return movements.filter(function(movement) {
            return movement.descripcion.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
    }
}
