export interface SelectChoicesMicro {
    name: string,
    value: string,
    image: string,
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
                {name: "Pieve", value: "church", image: "pieve-min.webp"},
                {name: "Albero Monumentale", value: "tree", image: "albero-monumentale-min.webp"},
                {name: "Muretto", value: "wall", image: "ruin.png"},
                {name: "Forno", value: "historic_oven", image: "forno-min.webp"},
                {name: "Lavatoio", value: "wash_house", image: "lavatoio-min.webp"},
                {name: "Cimitero", value: "cemetery", image: "cimitero-min.webp"},
                {name: "Edificio Storico", value: "historical_building", image: "casa-in-sasso-min.webp"},
                {name: "Falesia", value: "climbing_crag", image: "falesia-min.webp"},
                {name: "Calanchi", value: "ravine", image: "belvedere.png"},
                {name: "Borgo", value: "town", image: "borgo-min.webp"},
            ]
        }, {
            name: PoiEnums.SUPPORT_READ,
            value: "SUPPORT",
            micro: [
                {name: "Rifugio", value: "shalet", image: "shalet.png"},
                {name: "Fonte", value: "fountain", image: "fountain.png"},
                {name: "Bottega", value: "grocery_shop", image: "sign.png"},
                {name: "Supermercato", value: "supermarket", image: "sign.png"},
                {name: "Ufficio Informazioni", value: "iat", image: "sign.png"},
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