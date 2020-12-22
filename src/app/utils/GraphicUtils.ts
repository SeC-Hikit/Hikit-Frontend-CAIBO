export class GraphicUtils {

    public static getFullHeightSizeMenu() {
        let documentHeight: number = document.documentElement.scrollHeight;
        let headerWrapperHeight = document.getElementById("header-wrapper").offsetHeight;
        let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper").offsetHeight;
        let footerInfoHeight = document.getElementById("footer-info").offsetHeight;
        console.warn(footerInfoHeight);
        return documentHeight - headerWrapperHeight - slimHeaderWrapHeight - footerInfoHeight*2;
    }

    public static getFullHeightSizeWOMenu() {
        return document.documentElement.scrollHeight;
    }


}