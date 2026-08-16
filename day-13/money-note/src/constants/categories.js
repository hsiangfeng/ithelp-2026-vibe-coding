// 分類清單的唯一真實來源。
//
// 記錄裡存的是 id 不是顯示名稱，所以「已經用過的 id 不可以刪除或改名」——
// 改了舊記錄就對不到分類。要加分類就直接補一組新的 id。
//
// color 給統計頁的圓餅圖用。顏色只是輔助，名稱、金額、百分比一律另外有文字，
// 不靠顏色傳達任何資訊 —— canvas 讀不出來，色覺障礙也看不出差別。
export const CATEGORIES = [
  { id: 'food', name: '飲食', color: '#f97316' },
  { id: 'transport', name: '交通', color: '#0ea5e9' },
  { id: 'daily', name: '日用', color: '#14b8a6' },
  { id: 'entertainment', name: '娛樂', color: '#a855f7' },
  { id: 'medical', name: '醫療', color: '#ef4444' },
  { id: 'other', name: '其他', color: '#94a3b8' },
]

const NAME_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category.name]))
const COLOR_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category.color]))

// 對不到的 id 回傳原字串，讓那一列還是顯示得出來，不要整個畫面壞掉。
export function getCategoryName(id) {
  return NAME_BY_ID.get(id) ?? id
}

// 同樣要有 fallback：對不到就給灰色，圓餅圖才不會缺一塊沒顏色的扇形。
export function getCategoryColor(id) {
  return COLOR_BY_ID.get(id) ?? '#cbd5e1'
}
