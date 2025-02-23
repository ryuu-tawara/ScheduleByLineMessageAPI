/**
 * Line関連の処理
 * このファイルの参照は全てこのファイルを通して呼び出すこと
 */
class LineGateway {
  /**
   * Lineにmessageを送信する
   * 
   * @param messages 送信メッセージのリスト
   */
  sendMessage(messages) {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN')
    };
    const postData = {
      "to": PropertiesService.getScriptProperties().getProperty('GROUP_ID'),
      "messages": messages,
    };
    const options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(postData)
    };

    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
  }
}
