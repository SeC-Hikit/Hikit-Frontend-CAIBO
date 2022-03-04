export interface SelectChoicesMicro {
    name: string,
    value: string
}

export interface SelectChoicesMacro {
    name: string,
    value: string,
    micro: SelectChoicesMicro[]
}

export class PoiEnums {
    private static CULTURAL = "CULTURAL";
    private static SUPPORT = "SUPPORT";
    private static BELVEDERE = "BELVEDERE";

    private static SUPPORT_READ = "Supporto escursionistico";
    private static CULTURAL_READ = "Culturale";
    private static BELVEDERE_READ = "Belvedere";

    public static macroTypes: SelectChoicesMacro[] = [
        {
            name: PoiEnums.CULTURAL_READ,
            value: PoiEnums.CULTURAL,
            micro: [{name: "Pieve", value: "church"}, {name: "Muretto", value: "wall"}]
        }, {
            name: PoiEnums.SUPPORT_READ,
            value: "SUPPORT",
            micro: [{name: "Rifugio", value: "shallet"}, {name: "Fonte", value: "fountain"}]
        }, {
            name: PoiEnums.BELVEDERE_READ,
            value: "BELVEDERE",
            micro: []
        }]

    public static macroMap() : Map<string, string> {
        let map = new Map();
        map.set(PoiEnums.CULTURAL, PoiEnums.CULTURAL_READ)
        map.set(PoiEnums.SUPPORT, PoiEnums.SUPPORT_READ)
        map.set(PoiEnums.BELVEDERE, PoiEnums.BELVEDERE_READ);
        return map;
    }
}