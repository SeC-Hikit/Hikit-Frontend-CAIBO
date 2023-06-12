export class PaginationUtils {

    public static getUpperBound(page : number, entryPerPage: number) {
        return 0 ? 0 : entryPerPage;
    }

    public static getLowerBound(page: number, entryPerPage: number) {
        return entryPerPage * (page - 1);
    }

}