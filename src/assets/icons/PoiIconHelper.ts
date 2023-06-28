import {PoiDto} from "../../app/service/poi-service.service";

export class PoiIconHelper {

    public static get(poiDto: PoiDto): string {
        if (poiDto.macroType == "BELVEDERE") {
            return PoiIconHelper.getBelvedereIcon();
        } else if(poiDto.macroType == "CULTURAL") {
            return PoiIconHelper.getCulturalIcon(poiDto.microType);
        } else if(poiDto.macroType == "SUPPORT") {
            return PoiIconHelper.getSupportIcon(poiDto.microType);
        } else if(poiDto.macroType == "CURIOSITY") {
            return PoiIconHelper.getCuriosityIcon(poiDto.microType);
        }
    }

    private static getBelvedereIcon() {
        return `<img src='/assets/icons/poi/png/View_pin.png' width="24" alt="cultural_icon" />`;
    }

    private static getCulturalIcon(microType: string[]) {
        return `<img src='/assets/icons/poi/png/Ruin_pin.png' width="24" alt="cultural_icon" />`;
    }

    private static getSupportIcon(microType: string[]) {
        return `<img src='/assets/icons/poi/png/Tent_pin.png' width="24" alt="cultural_icon" />`;
    }

    private static getCuriosityIcon(microType: string[]) {
        return `<img src='/assets/icons/poi/png/Info_pin.png' width="24" alt="info_icon" />`;
    }
}