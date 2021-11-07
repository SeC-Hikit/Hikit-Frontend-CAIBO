import * as moment from "moment";

export class DateUtils {

    public static DATE_FORMAT = "dd-MM-yyyy";

    public static formatStringDateToDashes(day: string, month: string, year: string) {
        return day + "-" + month + "-" + year;
    }

    public static formatDateToDay(dateString: string): string {
        return moment(dateString).format("DD/MM/YYYY h:mm a");
    }
}