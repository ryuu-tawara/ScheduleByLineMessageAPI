/**
 * 日付関連の処理
 * このファイルの参照は全てこのファイルを通して呼び出すこと
 */
class DateUtilities {
  /**
   * 休日の配列を取得する
   * 
   * @param date 取得したい月の日付
   * @returns 休日の配列
   */
  getHolidayArray(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const holidayList = [];

    // 1日から31日まで繰り返し、休日のみをholidayListに設定する
    for (let day = 1; day <= 31; day++) {
      const targetDate = new Date(year, month, day);

      if (targetDate.getMonth() !== month) break; // 月が代わると処理を終了する

      if (!isHoliday(targetDate)) continue;

      holidayList.push([targetDate]);
    }

    return holidayList;
  }

  /**
   * 休日の文字列配列を取得する
   * 例: ["2025年3月1日(土)", "2025年3月2日(日)", ...]
   * 
   * @param date 取得したい月の日付
   * @returns 休日の文字列配列
   */
  getShowHolidayArray(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const holidayList = [];

    // 1日から31日まで繰り返し、休日のみをholidayListに設定する
    for (let day = 1; day <= 31; day++) {
      const targetDate = new Date(year, month, day);

      if (targetDate.getMonth() !== month) break; // 月が代わると処理を終了する

      if (!isHoliday(targetDate)) continue;

      holidayList.push(
        Utilities.formatDate(targetDate, "JST", "yyyy年M月d日") +
        `(${["日", "月", "火", "水", "木", "金", "土"][targetDate.getDay()]})`
      );
    }

    return holidayList;
  }
}

/**
 * 土日、祝日かどうかの判定をする
 * 
 * @param date 日付
 * @returns true: 休日, false: 休日でない
 */
function isHoliday(date) {
  // 休日判定 (0:日曜日, 6:土曜日)
  const day = date.getDay();
  if (day == 0 || day == 6) return true;

  // 祝日判定(カレンダーから判定)
  const calendar = CalendarApp.getCalendarById("ja.japanese#holiday@group.v.calendar.google.com");
  return calendar.getEventsForDay(date).length > 0;
}
