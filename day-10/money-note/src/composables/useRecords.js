import { computed, ref } from 'vue'
import { currentMonthKey } from '../utils/format.js'

// 全專案唯一碰 localStorage 的地方。元件不直接讀寫，將來要換成 API 呼叫時只改這個檔。
const STORAGE_KEY = 'money-note:records:v1'

// 讀不到或讀壞了一律當成空陣列，不要讓整個 app 掛掉。
// JSON.parse(null) 會回傳 null、壞字串會 throw，兩種都要收斂，所以兩道防線都不能省。
function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// crypto.randomUUID 只在 secure context 有值。手機實機測試走 `npm run dev -- --host`
// 是 http，沒有這個 fallback 的話按下存檔會直接爆，而且只在手機上爆。
function newId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// module 層級的單例：所有元件共用同一份 state，才不會各自持有一份舊資料。
const records = ref(load())
const monthKey = ref(currentMonthKey())

// 一筆屬於哪個月一律看 date，不看 createdAt（補記昨天的帳時兩者會是不同天）。
// date 本身就是當地時間的字串，直接切前七碼比較，不要繞去 new Date()。
const monthRecords = computed(() =>
  records.value
    .filter((record) => record.date.slice(0, 7) === monthKey.value)
    // 日期新到舊，同一天再依 createdAt 新到舊
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
)

const monthTotal = computed(() =>
  monthRecords.value.reduce((sum, record) => sum + record.amount, 0),
)

function addRecord({ amount, category, date, note }) {
  records.value.push({
    id: newId(),
    amount,
    category,
    date,
    note,
    createdAt: Date.now(),
  })
  save(records.value)
}

export function useRecords() {
  return { records, monthKey, monthRecords, monthTotal, addRecord }
}
