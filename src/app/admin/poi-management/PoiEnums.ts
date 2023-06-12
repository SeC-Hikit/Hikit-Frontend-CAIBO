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
            micro: [
                {name: "Pieve", value: "church"},
                {name: "Albero Monumentale", value: "tree"},
                {name: "Muretto", value: "wall"},
                {name: "Forno", value: "historic_oven"},
                {name: "Lavatoio", value: "wash_house"},
                {name: "Cimitero", value: "cemetery"},
                {name: "Edificio Storico", value: "historical_building"},
                {name: "Falesia", value: "climbing_crag"},
            ]
        }, {
            name: PoiEnums.SUPPORT_READ,
            value: "SUPPORT",
            micro: [
                {name: "Rifugio", value: "shalet"},
                {name: "Fonte", value: "fountain"},
                {name: "Bottega", value: "grocery_shop"},
                {name: "Supermercato", value: "supermarket"},
                {name: "Ufficio Informazioni", value: "iat"},
            ]
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