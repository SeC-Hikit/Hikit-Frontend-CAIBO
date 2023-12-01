import {Pipe, PipeTransform} from '@angular/core';

/**
 * Converts from minutes to more readable time (like '1:30h' in Italian)
 */
@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(value: string): string {
    if(value.length > 30) return value.slice(0, 30) + "...";
    return value;
  }
}