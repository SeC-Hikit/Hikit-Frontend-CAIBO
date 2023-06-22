import { Pipe, PipeTransform } from '@angular/core';
import {DateUtils} from "./utils/DateUtils";
/**
 * Converts from minutes to more readable time (like '1h and half' in Italian)
 */
@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
  transform(value: string): string {
    return DateUtils.formatDateToIta(value)
  }
}