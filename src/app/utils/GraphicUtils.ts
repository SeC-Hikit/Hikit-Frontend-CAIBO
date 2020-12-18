export class GraphicUtils {

    public static getFullHeightSizeMenu() {
        let documentHeight: number = document.documentElement.scrollHeight;
        let headerWrapperHeight = document.getElementById("header-wrapper").offsetHeight;
        let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper").offsetHeight;
        return documentHeight - headerWrapperHeight - slimHeaderWrapHeight;
    }

    public static getFullHeightSizeWOMenu() {
        return document.documentElement.scrollHeight;
    }


}