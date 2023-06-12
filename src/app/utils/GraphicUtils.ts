export class GraphicUtils {
    
  public static getMenuHeight() {
    let headerWrapperHeight = document.getElementById("header-wrapper")
      .offsetHeight;
    return headerWrapperHeight;
  }

  public static getFullHeightSizeMenu() {
    let documentHeight: number = document.documentElement.scrollHeight;
    let headerWrapperHeight = document.getElementById("header-wrapper")
      .offsetHeight;
    let footerInfoHeight = document.getElementById("footer-info").offsetHeight;
    return (
      documentHeight -
      headerWrapperHeight -
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
    let number = headerWrapperHeight;
    return document.documentElement.clientHeight - number;
  }
}
