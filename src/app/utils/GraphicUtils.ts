export class GraphicUtils {
    
  public static getMenuHeight() {
    let headerWrapperHeight = document.getElementById("header-wrapper")
      .offsetHeight;
    let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper")
      .offsetHeight;
    return headerWrapperHeight + slimHeaderWrapHeight;
  }

  public static getFullHeightSizeMenu() {
    let documentHeight: number = document.documentElement.scrollHeight;
    let headerWrapperHeight = document.getElementById("header-wrapper")
      .offsetHeight;
    let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper")
      .offsetHeight;
    let footerInfoHeight = document.getElementById("footer-info").offsetHeight;
    return (
      documentHeight -
      headerWrapperHeight -
      slimHeaderWrapHeight -
      footerInfoHeight * 2
    );
  }

  public static getFullHeightSizeWOMenu() {
    return document.documentElement.scrollHeight;
  }

  public static getFullHeightSizeWOMenuMap() {
    return document.documentElement.scrollHeight;
  }

  public static getFullHeightSizeWOMenuImage() {
    return document.documentElement.clientHeight;
  }

  public static getFullHeightSizeWOMenuHeights() {
    let headerWrapperHeight = document.getElementById("header-wrapper")
        .offsetHeight;
    let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper")
        .offsetHeight;
    let number = headerWrapperHeight + slimHeaderWrapHeight;
    return document.documentElement.clientHeight - number;
  }
}
