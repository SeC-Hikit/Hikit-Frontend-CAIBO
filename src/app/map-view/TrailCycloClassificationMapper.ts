export class TrailCycloClassificationMapper {
    public static map(value: string) {
        switch (value) {
            case "TC_PLUS":
                return "TC+";
            case "MC_PLUS":
                return "MC+";
            case "BC_PLUS":
                return "BC+";
            case "OC_PLUS":
                return "OC+";
            case "UNCLASSIFIED":
                return "N/A";
            case "NO":
                return "";
            default:
                return value;
        }
    }
}