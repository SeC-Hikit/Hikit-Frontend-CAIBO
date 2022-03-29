import { Pipe, PipeTransform } from '@angular/core';
/**
 * Converts from minutes to more readable time (like '1h and half' in Italian)
 */
@Pipe({ name: 'eta' })
export class EtaPipe implements PipeTransform {
  transform(value: number): string {
    const h = Math.floor(value / 60)
    const min = Math.floor(value % 60)
    const quarters = Math.floor(min / 15);

    let formattedString = "";

    if(value == 0) {
      return "Non ancora attribuito";
    }

    if(value <= 5) {
      return "5 minuti";
    }

    if (h != 0) {
      let hs = h > 1 ? "e" : "a"
      formattedString += h + " or" + hs + " ";
    }
    if (quarters > 0) {
      if (quarters == 2) {
        formattedString += "30";
      } else {
        let qs = quarters > 1 ? "45" : "15"
        formattedString += qs;
      }
      formattedString += " minuti";
    }
    return formattedString;
  }
}