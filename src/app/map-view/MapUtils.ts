import { TrailCoordinates } from '../trail-service.service';
import { TrailClassification } from '../TrailClassification';

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

    static getLineStyle(isSelectedLine: boolean, trailClassification: String) {
        var trailColor = MapUtils.getLineColor(isSelectedLine);
        switch (trailClassification) {
          case TrailClassification.E:
            return {
              weight: MapUtils.LINE_WEIGHT,
              color: trailColor,
              dashArray: "5, 10",
            };
          case TrailClassification.EEA:
            return {
              weight: MapUtils.LINE_WEIGHT,
              color: trailColor,
              dashArray: "2, 10",
            };
          case TrailClassification.EE:
            return {
              weight: MapUtils.LINE_WEIGHT,
              color: trailColor,
              dashArray: "3, 10",
            };
          default:
            return { weight: MapUtils.LINE_WEIGHT, color: trailColor };
        }
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