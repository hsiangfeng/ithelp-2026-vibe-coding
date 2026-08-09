// 金額與日期的格式化，以及「今天」「本月」的取值。
//
// 時間一律用當地時間，不用 UTC —— toISOString() 會在台灣早上八點前產生差一天的結果，
// 所以這裡全部走 Date 的 getFullYear / getMonth / getDate。
// 這條規則只寫在這個檔案裡，其他地方一律呼叫這些函式，不要自己組。

const amountFormatter = new Intl.NumberFormat('zh-TW')

const pad = (value) => String(value).padStart(2, '0')

// 1200 → "$1,200"
export function formatAmount(amount) {
  return `$${amountFormatter.format(amount)}`
}

// "2026-08-07" → "08/07"
// 直接切字串，不繞去 new Date()：那會把日期當成 UTC 午夜解析，在台灣是前一天。
export function formatMonthDay(date) {
  return `${date.slice(5, 7)}/${date.slice(8, 10)}`
}

// 當地時間的今天，YYYY-MM-DD
export function today() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// 當地時間的本月，YYYY-MM
export function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
}
