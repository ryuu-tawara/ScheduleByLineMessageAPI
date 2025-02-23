/** import　file */
var spreadsheetMapper = new SpreadsheetMapper();
var dateUtilities = new DateUtilities();
var lineGateway = new LineGateway();
/** */

/**
 * 飲み会は2ヶ月に1回実施するため
 * 当月が2ヶ月目か判定する
 * 
 * @return true: 今月が奇数, false: 今月が偶数
 */
function isSkipBatch() {
  const month = new Date().getMonth() + 1; // 月は0から数えた値が返却されるため+1する

  return month % 2 != 0;
}

/**
 * 翌月のスプレッドシートを作成するバッチ。
 * シートの作成と同時に休日の日付を書き込む。
 */
function spreadSheetSettingBatch() {
  if (isSkipBatch()) return;

  // データの準備
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const newSheetName = Utilities.formatDate(nextMonth, 'Asia/Tokyo', 'yyyy-MM');
  const holidayArray = dateUtilities.getHolidayArray(nextMonth);

  // スプレッドシートへの書き込み
  const newSheet = spreadsheetMapper.createSheet(newSheetName);
  spreadsheetMapper.writeVertical(newSheet, 2, 1, holidayArray); // 1行目はユーザー名が入るため2行目(A2)から書き込みする
}

/**
 * Lineグループに集計メッセージを送信する
 */
function invitingMessageBatch() {
  if (isSkipBatch()) return;

  const appURL = ScriptApp.getService().getUrl() + "?openExternalBrowser=1";

  const messages = [
    {
      "type": "flex",
      "altText": "飲み会を開催します！",
      "contents": {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://media.istockphoto.com/id/1488769507/ja/%E3%83%99%E3%82%AF%E3%82%BF%E3%83%BC/%E3%82%A2%E3%83%AB%E3%82%B3%E3%83%BC%E3%83%AB%E3%82%B0%E3%83%A9%E3%82%B9%E4%B9%BE%E6%9D%AF%E3%81%99%E3%82%8B%E6%89%8B%E3%81%AE%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88.jpg?s=612x612&w=0&k=20&c=r9aINp1YVcq--wAd4V6W_oazMZigZZ1GIRdAB8-UVAU=",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": appURL
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "翌月に飲み会を開催します！",
              "weight": "bold",
              "offsetBottom": "5px"
            },
            {
              "type": "text",
              "text": "2月26日までに入力してください。", // TODO メッセージは仮のため要修正
              "size": "13px",
              "weight": "bold",
              "offsetBottom": "5px"
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "参加できる日を選択する",
                "uri": appURL
              },
              "style": "primary"
            },
            {
              "type": "text",
              "text": "※このメッセージは2か月に1度送信されます",
              "offsetTop": "10px",
              "size": "10px"
            }
          ],
          "action": {
            "type": "uri",
            "label": "action",
            "uri": appURL
          }
        }
      }
    }
  ];

  new lineGateway.sendMessage(messages);
}
