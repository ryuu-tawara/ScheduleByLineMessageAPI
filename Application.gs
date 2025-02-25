/** import　file */
var spreadsheetMapper = new SpreadsheetMapper();
var dateUtilities = new DateUtilities();
var lineGateway = new LineGateway();
/** */

/**
 * Getメソッド
 */
function doGet(e) {

  // 必要な権限を取得する
  ScriptApp.requireScopes(ScriptApp.AuthMode.FULL, [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets"
  ]);

  const mailAdddress = Session.getActiveUser().getEmail();

  if (isInvalideMailAddress(mailAdddress)) {
    return HtmlService.createHtmlOutput(
      "<html><body><h1>不正なアクセスです。管理者に報告してください。</h1></body></html>"
    );
  }

  let html;
  if (e.parameter.page == "sendDates" && e.parameter.holidayValues != null) {
    sendData(mailAdddress, e.parameter.holidayValues.split(","));
    lineGateway.sendMessage([{"type": "text", "text": `${mailAdddress}さん、入力ありがとう！`}]);

    // 1秒だけ完了画面を表示する
    const waitTime = 1;
    html = HtmlService.createHtmlOutput(`<meta http-equiv='refresh' content='${waitTime};URL=https://line.me/R/nv/chat'><html><body><h1>データを送信し、トーク画面に遷移します。ご協力ありがとうございました。</h1></body></html>`);
  } else {
    html = HtmlService.createTemplateFromFile("index").evaluate();
  }

  return html;
}

/**
 * メールアドレスのバリエーションチェックをする
 * 
 * @returns true: チェックNG, false: チェックOK
 */
function isInvalideMailAddress(mailAdddress) {
  // TODO 環境変数にユーザーのメアドを登録して、その中にあるかのチェックも行う
  return mailAdddress == null;
}

/**
 * スプレッドシートにメールアドレスと休日の書き込みを実施する
 * 
 * @param mailAdddress メールアドレス(飲み会の参加者ID)
 * @param holidayValues 休日の参加、不参加の配列(参加:1, 不参加:0)
 */
function sendData(mailAdddress, holidayValues) {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const writeSheetName = Utilities.formatDate(nextMonth, 'Asia/Tokyo', 'yyyy-MM');
  const writeSheet = spreadsheetMapper.getSheet(writeSheetName);

  const indexOfMailAddress = getIndexWithWriteMailAdddress(writeSheet, mailAdddress);

  // スプレッドシートに縦で書き込む場合は、[[1],[0],[1]...]というような配列とする必要があるため、書き換える
  const holidayValueArray = [];
  for(let value of holidayValues) {
    holidayValueArray.push([value]);
  }

  spreadsheetMapper.writeVertical(writeSheet, 2, indexOfMailAddress, holidayValueArray);
}

/**
 * スレッドシートに該当のメールアドレスがあるかを確認し、無い場合は書き込みを実施しインデックスを取得する
 * 
 * @param mailAdddress メールアドレス(飲み会の参加者ID)
 * @returns スレッドシートのメールアドレスがある列番号
 */
function getIndexWithWriteMailAdddress(writeSheet, mailAdddress) {
  // B1~F1にメールアドレスが入る
  const mailAdddressArray = spreadsheetMapper.getHorizontalValue(writeSheet, 1, 2, 5).filter(value => value.trim());
  const mailAdddressIndex = mailAdddressArray.indexOf(mailAdddress);

  // indexは0始まりかつ、1列目は空文字のためプラス2する
  if(mailAdddressIndex != -1) return mailAdddressIndex + 2;

  // 縦列書き込み用のメソッドだが、1マスの書き込みも可能なため使用している(2列目~に書き込む))
  spreadsheetMapper.writeVertical(writeSheet, 1, 2 + mailAdddressArray.length, [[mailAdddress]]);

  return mailAdddressArray.length + 2; // 1列目は空文字かつ、最後尾の1つ後にメールアドレスを追加するためプラス2する
}

/**
 * 
 * 以下、jsから呼び出すメソッド
 * 
 */

/**
 * アプリのURLを取得する
 */
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * 表示する休日文字の配列を取得する
 */
// TODO 遅いので性能改善したい
function getShowHolidays() {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  return dateUtilities.getShowHolidayArray(nextMonth);
}
