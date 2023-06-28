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
    private static CURIOSITY = "CURIOSITY";

    private static SUPPORT_READ = "Supporto escursionistico";
    private static CULTURAL_READ = "Culturale";
    private static BELVEDERE_READ = "Belvedere";
    private static CURIOSITY_READ = "Curiosità";

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
                {name: "Edificio Storico", value: "historical_building", image: "edificio_storico.webp"},
                {name: "Casa rurale", value: "country_house", image: "casa-in-sasso-min.webp"},
                {name: "Falesia", value: "climbing_crag", image: "falesia-min.webp"},
                {name: "Calanchi", value: "ravine", image: "calanco.webp"},
                {name: "Borgo", value: "town", image: "borgo-min.webp"},
            ]
        }, {
            name: PoiEnums.SUPPORT_READ,
            value: "SUPPORT",
            micro: [
                {name: "Rifugio", value: "shalet", image: "shalet.png"},
                {name: "Fonte", value: "fountain", image: "fountain.png"},
                {name: "Bottega", value: "grocery_shop", image: "bottega.webp"},
                {name: "Supermercato", value: "supermarket", image: "supermarket.webp"},
                {name: "Ufficio Informazioni", value: "iat", image: "ufficio_turistico.webp"},
            ]
        }, {
            name: PoiEnums.BELVEDERE_READ,
            value: "BELVEDERE",
            micro: []
        },
        {
            name: PoiEnums.CURIOSITY_READ,
            value: "CURIOSITY",
            micro: [
                {name: "Luogo storico", value: "history_landmark", image: "curiosity-min.webp"},
                {name: "Fiaba", value: "fable", image: "curiosity-min.webp"},
                {name: "Citazione", value: "mention", image: "curiosity-min.webp"}
            ]
        }
    ]

    public static macroMap() : Map<string, string> {
        let map = new Map();
        map.set(PoiEnums.CULTURAL, PoiEnums.CULTURAL_READ)
        map.set(PoiEnums.SUPPORT, PoiEnums.SUPPORT_READ)
        map.set(PoiEnums.BELVEDERE, PoiEnums.BELVEDERE_READ);
        map.set(PoiEnums.CURIOSITY, PoiEnums.CURIOSITY_READ);
        return map;
    }
}