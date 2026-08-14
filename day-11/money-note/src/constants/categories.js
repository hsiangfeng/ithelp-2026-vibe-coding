// 分類清單的唯一真實來源。
//
// 記錄裡存的是 id 不是顯示名稱，所以「已經用過的 id 不可以刪除或改名」——
// 改了舊記錄就對不到分類。要加分類就直接補一組新的 id。
export const CATEGORIES = [
  { id: 'food', name: '飲食' },
  { id: 'transport', name: '交通' },
  { id: 'daily', name: '日用' },
  { id: 'entertainment', name: '娛樂' },
  { id: 'medical', name: '醫療' },
  { id: 'other', name: '其他' },
]

const NAME_BY_ID = new Map(CATEGORIES.map((category) => [category.id, category.name]))

// 對不到的 id 回傳原字串，讓那一列還是顯示得出來，不要整個畫面壞掉。
export function getCategoryName(id) {
  return NAME_BY_ID.get(id) ?? id
}
