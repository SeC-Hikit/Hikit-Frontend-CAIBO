import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'increaseOne'})
export class IncreasedIndexPipe implements PipeTransform {
  transform(value: number, exponent?: number): number {
    return value + 1;
  }
}