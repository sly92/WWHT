import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isArray' })
export class IsArrayPipe implements PipeTransform {
    transform(x): any {
        return Array.isArray(x) ? x : [x];
    }
}