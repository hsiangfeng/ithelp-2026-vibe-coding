import { computed, ref } from 'vue'
import { CATEGORIES, getCategoryName } from '../constants/categories.js'
import { currentMonthKey, shiftMonthKey } from '../utils/format.js'

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

// 「本月」依當地時間的今天判定，與 date 欄位的時區規則一致（都走 format.js）。
const isCurrentMonth = computed(() => monthKey.value === currentMonthKey())

// 切上／下個月。SPEC 5.1 明寫不限制可切到多久以前或以後，所以這裡不設上下限。
function shiftMonth(delta) {
  monthKey.value = shiftMonthKey(monthKey.value, delta)
}

function goToCurrentMonth() {
  monthKey.value = currentMonthKey()
}

// 金額相同時的排序依據。SPEC 只寫「依金額由大到小」，沒說平手怎麼辦 ——
// 不定規則的話順序會跟著記錄的輸入順序漂移，同一份資料重整前後可能換位。
const CATEGORY_ORDER = new Map(CATEGORIES.map((category, index) => [category.id, index]))
const orderOf = (id) => CATEGORY_ORDER.get(id) ?? CATEGORIES.length

// 該月各分類的金額與佔比，已排序、已算好百分比，元件直接畫就好。
//
// 從記錄反推分類，不是拿 CATEGORIES 去對記錄 —— 該月沒花到的分類根本不會進 Map，
// 自然不會列出一排 0。順帶讓萬一對不到 CATEGORIES 的舊 id 也還是算得進去，
// 橫條加起來才不會跟本月總額對不上。
const categoryStats = computed(() => {
  const total = monthTotal.value
  if (total === 0) return []

  const sums = new Map()
  for (const record of monthRecords.value) {
    sums.set(record.category, (sums.get(record.category) ?? 0) + record.amount)
  }

  return [...sums]
    .map(([id, amount]) => ({
      id,
      name: getCategoryName(id),
      amount,
      // 四捨五入到整數，加起來不見得剛好 100%，這是 SPEC 允許的，不要另外補償。
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount || orderOf(a.id) - orderOf(b.id))
})

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

// TODO 後面練習用：改成用 id
// 收到的 index 是「畫面清單上的第幾筆」，卻直接套在 records 上（records 是存檔先後順序）。
function updateRecordAt(index, { amount, category, date, note }) {
  const target = records.value[index]
  // 擋的是 index 為 null 或超出範圍，不是擋「對到別筆」。
  if (!target) return
  // 展開合併而不是逐欄指派：id 與 createdAt 自動留著（SPEC 5.2「編輯時」），
  // 將來資料多一個欄位也不會漏掉。
  records.value[index] = { ...target, amount, category, date, note }
  save(records.value)
}

// TODO 後面練習用：改成用 id
function deleteRecordAt(index) {
  if (!records.value[index]) return
  records.value.splice(index, 1)
  save(records.value)
}

export function useRecords() {
  return {
    records,
    monthKey,
    monthRecords,
    monthTotal,
    categoryStats,
    isCurrentMonth,
    shiftMonth,
    goToCurrentMonth,
    addRecord,
    updateRecordAt,
    deleteRecordAt,
  }
}
