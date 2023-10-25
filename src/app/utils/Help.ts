export class Help {

    public static getDescription(minor: boolean) {
        if(minor) return "Il problema di percorrenza è segnato come 'aggirabile'. <br/> Ciò significa che si tratta " +
            "di un elemento di attenzione non bloccante e di bassa entità. <br/>" +
            "È comunque necessario prestare attenzione al sentiero, e attenersi al buonsenso."
        return "Il problema di percorrenza è segnato come 'non aggirabile'. <br/> Ciò significa che si " +
            "tratta di un elemento di attenzione possibilmente bloccante e/o di grave entità, " +
            "che potrebbe rendere difficile o potenzialmente pericoloso l'attraversamento del sentiero.</br>" +
            "Prestare dunque attenzione durante la percorrenza."
    }
}