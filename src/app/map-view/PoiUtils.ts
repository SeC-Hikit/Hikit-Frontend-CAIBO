import {PoiEnums} from "../admin/poi-management/PoiEnums";

export class PoiUtils {
    public static getImage(macroType: "BELVEDERE" | "SUPPORT" | "CULTURAL" | "CURIOSITY", microType: string[]) {
        const base_folder = "assets/cai/poi/";

        if(macroType == "BELVEDERE") {
            return base_folder + "belvedere.png";
        }
        const microtypes = PoiEnums.macroTypes.filter((it) => it.value == macroType)[0].micro;
        const foundMicrotype = microtypes.filter(it=> it.value == microType[0]);
        const electMicrotype = foundMicrotype.length > 0 ? foundMicrotype[0] : microtypes[0];
        return base_folder + electMicrotype.image
    }
}