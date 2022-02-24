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
    public static macroTypes: SelectChoicesMacro[] = [
        {
            name: "Culturale",
            value: "CULTURAL",
            micro: [{name: "Pieve", value: "church"}, {name: "Muretto", value: "wall"}]
        }, {
            name: "Supporto escursionistico",
            value: "SUPPORT",
            micro: [{name: "Rifugio", value: "shallet"}, {name: "Fonte", value: "fountain"}]
        }, {
            name: "Belvedere",
            value: "LANDSCAPE",
            micro: []
        }]
}