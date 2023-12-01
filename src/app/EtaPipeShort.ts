import { Pipe, PipeTransform } from '@angular/core';
/**
 * Converts from minutes to more readable time (like '1:30h' in Italian)
 */
@Pipe({ name: 'etaShort' })
export class EtaShortPipe implements PipeTransform {
  transform(value: number): string {
    const h = Math.floor(value / 60)
    const min = Math.floor(value % 60)
    const quarters = Math.floor(min / 15);

    let formattedString = "";

    if(value == 0) {
      return "Non ancora attribuito";
    }

    if(value <= 5) {
      return "5min";
    }

    if (h != 0) {
      formattedString += h;
    } else {
      formattedString += "00"
    }
    formattedString += ":";
    if (quarters > 0) {
      if (quarters == 1) {
        formattedString += "15";
      }
      if (quarters == 2) {
        formattedString += "30";
      } if (quarters == 3) {
        formattedString += "45";
      }
    } else {
      formattedString += "00";
    }

    formattedString += "h";
    return formattedString;
  }
}