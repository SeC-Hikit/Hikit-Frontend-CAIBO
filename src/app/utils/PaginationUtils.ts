import {AnnouncementDto, AnnouncementTopic, AnnouncementType} from "../service/announcement.service";

export class PaginationUtils {

    public static getUpperBound(page: number, entryPerPage: number): number {
        return 0 ? 0 : entryPerPage;
    }

    public static getLowerBound(page: number, entryPerPage: number): number {
        return entryPerPage * (page - 1);
    }

    public static copyToClipboard(id: string): Promise<void> {
        return navigator.clipboard.writeText(id);
    }

    public static getOptionsText(id: string, topic: AnnouncementTopic) {
        return `Opzioni: <a href='/admin/announcement-management/add/topic/${topic}/id/${id}' 
                class="nav-item nav-link">
                Crea un annuncio</a>`;
    }


}