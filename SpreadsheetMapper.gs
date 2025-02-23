/**
 * スプレッドシート関連の処理
 * このファイルの参照は全てSpreadsheetMapperクラスを通して呼び出すこと
 */
class SpreadsheetMapper {
  /**
   * スプレッドシートを取得する
   * 
   * @param sheetName 参照したいシート名
   * @return 対象シート
   */
  getSheet(sheetName) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  }
  /**
   * スプレッドシートに読み込む(横方向)
   * https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja#getrangerow,-column,-numrows,-numcolumns
   * 
   * @param sheet 読み込みするシート
   * @param row 行 (読み込みを開始する行)
   * @param column 列 (読み込みを開始する列)
   * @param length 列数 
   */
  getHorizontalValue(sheet, row, column, length) {
    return sheet.getRange(row, column, 1, length).getValues()[0];
  }

  /**
   * スプレッドシートを作成する
   * 
   * @param sheetName 新規スプレッドシート名
   * @return 作成したシート
   */
  createSheet(sheetName) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    newSheet.setName(sheetName);

    return newSheet;
  }

  /**
   * スプレッドシートに書き込む(縦方向)
   * https://developers.google.com/apps-script/reference/spreadsheet/sheet?hl=ja#getrangerow,-column,-numrows
   * 
   * @param sheet 書き込みするシート
   * @param row 行 (書き込みを開始する行)
   * @param column 列 (書き込みを開始する列)
   * @param verticalArray 縦の配列(例: [[1],[2],[3],[4]])
   */
  writeVertical(sheet, row, column, verticalArray) {
    sheet.getRange(row, column, verticalArray.length).setValues(verticalArray);
  }
}
