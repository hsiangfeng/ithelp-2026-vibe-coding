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
  updateRecord,
  deleteRecord,
} = useRecords()

const isFormOpen = ref(false)
// null 代表新增模式，有值就是正在編輯的那筆記錄的 id。
// 用 id 而不是畫面 index：清單是篩過、排過的，index 對不回儲存陣列。
const editingId = ref(null)

const editingRecord = computed(() =>
  editingId.value === null
    ? null
    : (monthRecords.value.find((record) => record.id === editingId.value) ?? null),
)

function openCreate() {
  editingId.value = null
  isFormOpen.value = true
}

function openEdit(id) {
  editingId.value = id
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
  editingId.value = null
}

function onSave(payload) {
  if (editingId.value === null) addRecord(payload)
  else updateRecord(editingId.value, payload)
  closeForm()
}

function onDelete() {
  if (editingId.value === null) return
  deleteRecord(editingId.value)
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
