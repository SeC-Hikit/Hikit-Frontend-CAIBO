import * as moment from "moment";

export class DateUtils {

    public static formatDateToDay(dateString: string): string {
        return moment(dateString).format("DD/MM/YYYY h:mm a");
    }
}