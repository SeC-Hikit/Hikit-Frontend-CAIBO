import {Pipe, PipeTransform} from '@angular/core';

/**
 * Converts from minutes to more readable time (like '1h and half' in Italian)
 */
@Pipe({name: 'extRes'})
export class ExternalResourcePipe implements PipeTransform {
    transform(value: string): string {
        const wHttps = value.replace("https://", "");
        const wHttp = wHttps.replace("http://", "");
        const wWWW = wHttp.replace("www.", "");
        const split = wWWW.split("/");
        if (split.length > 0) {
            return split[0] + "/" + split[1];
        }
        return split[0];
    }
}