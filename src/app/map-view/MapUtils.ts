import { TrailCoordinates } from '../TrailCoordinates';

export class MapUtils {
    
    public static get LINE_WEIGHT(): number { return 3 };
    
    public static getCoordinatesInverted(coordinates: TrailCoordinates[]): [number, number][] {
        return coordinates.map(x => [x.latitude, x.longitude]);
    }
    
    public static generateTextForMap(code: string): string {
        return this.generateEmptySpace() +
        code +
        this.generateEmptySpace();
    }
    
    public static generateEmptySpace(): string {
        var empty = "";
        for (let index = 0; index < 70; index++) {
            empty += " ";
        }
        return empty;
    }
    
    static getLineColor(isSelectedLine: boolean) : string {
        return isSelectedLine ? "red" : "#ff5252"
    }
    
    static getTextSyle(isSelectedLine : boolean): any {
        return {
            repeat: true,
            offset: -10,
            attributes: { fill: this.getLineColor(isSelectedLine), below: true },
            center: true
        }
    }
}