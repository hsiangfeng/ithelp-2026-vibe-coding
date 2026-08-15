<script setup>
import { computed, ref } from 'vue'
import CategoryChart from './components/CategoryChart.vue'
import MonthSwitcher from './components/MonthSwitcher.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import { useRecords } from './composables/useRecords.js'

const {
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
} = useRecords()

const isFormOpen = ref(false)
// TODO 後面練習用：改成用 id
// null 代表新增模式，有數字就是「畫面清單上的第幾筆」。
const editingIndex = ref(null)

const editingRecord = computed(() =>
  editingIndex.value === null ? null : (monthRecords.value[editingIndex.value] ?? null),
)

function openCreate() {
  editingIndex.value = null
  isFormOpen.value = true
}

// TODO 後面練習用：改成用 id
function openEdit(index) {
  editingIndex.value = index
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingIndex.value = null
}

function onSave(payload) {
  // TODO 後面練習用：改成用 id
  if (editingIndex.value === null) addRecord(payload)
  else updateRecordAt(editingIndex.value, payload)
  closeForm()
}

function onDelete() {
  if (editingIndex.value === null) return
  // TODO 後面練習用：改成用 id
  deleteRecordAt(editingIndex.value)
  closeForm()
}
</script>

<template>
  <div class="mx-auto flex min-h-dvh max-w-md flex-col bg-slate-50">
    <MonthSwitcher
      :month-key="monthKey"
      :total="monthTotal"
      :is-current-month="isCurrentMonth"
      @prev="shiftMonth(-1)"
      @next="shiftMonth(1)"
      @current="goToCurrentMonth"
    />

    <!-- 分類佔比與流水清單共用同一個空狀態開關，不會只剩半張圖。 -->
    <main class="flex-1 space-y-2 pb-32">
      <template v-if="monthRecords.length">
        <CategoryChart :stats="categoryStats" />
        <RecordList :records="monthRecords" @select="openEdit" />
      </template>
      <div v-else class="flex flex-col items-center gap-2 px-6 py-24 text-center">
        <p class="text-sm text-slate-500">這個月還沒有任何記錄</p>
        <p class="text-xs text-slate-400">按右下角的 ＋ 記下第一筆支出</p>
      </div>
    </main>

    <!-- 外層跟著內容欄置中，桌機上按鈕才不會飛到螢幕最右邊。 -->
    <div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto h-0 max-w-md">
      <button
        type="button"
        class="pointer-events-auto absolute right-5 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-3xl leading-none text-white shadow-lg"
        aria-label="新增一筆支出"
        @click="openCreate"
      >
        ＋
      </button>
    </div>

    <RecordForm
      :open="isFormOpen"
      :record="editingRecord"
      @save="onSave"
      @delete="onDelete"
      @close="closeForm"
    />
  </div>
</template>
