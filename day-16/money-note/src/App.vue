<script setup>
import { computed, ref } from 'vue'
import MonthSwitcher from './components/MonthSwitcher.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import StatsPanel from './components/StatsPanel.vue'
import TabBar from './components/TabBar.vue'
import { useRecords } from './composables/useRecords.js'

const {
  monthKey,
  monthRecords,
  monthTotal,
  monthCount,
  categoryStats,
  isCurrentMonth,
  shiftMonth,
  goToCurrentMonth,
  addRecord,
  updateRecord,
  deleteRecord,
} = useRecords()

// 目前在哪一個分頁。純粹的畫面狀態，不進 useRecords（那裡只管資料）。
// 月份切換列在兩個分頁之上、不隨分頁重置，切到三月看記帳、切過去統計也還是三月。
const activeTab = ref('records')

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

    <!-- pb 要留得下底部分頁列加浮動按鈕，否則最後一筆記錄會被蓋住。 -->
    <main class="flex-1 pb-40">
      <template v-if="activeTab === 'records'">
        <RecordList v-if="monthRecords.length" :records="monthRecords" @select="openEdit" />
        <div v-else class="flex flex-col items-center gap-2 px-6 py-24 text-center">
          <p class="text-sm text-slate-500">這個月還沒有任何記錄</p>
          <p class="text-xs text-slate-400">按右下角的 ＋ 記下第一筆支出</p>
        </div>
      </template>

      <StatsPanel
        v-else
        :total="monthTotal"
        :count="monthCount"
        :stats="categoryStats"
        :is-current-month="isCurrentMonth"
      />
    </main>

    <!-- 外層跟著內容欄置中，桌機上按鈕才不會飛到螢幕最右邊。 -->
    <div class="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto h-0 max-w-md">
      <!--
        只在記帳頁出現：統計頁按 ＋ 記完帳，畫面停在統計頁上會讓人以為沒存進去。
        bottom 要墊過底部分頁列的高度，不然按鈕會壓在「記帳／統計」上面。
      -->
      <button
        v-if="activeTab === 'records'"
        type="button"
        class="pointer-events-auto absolute right-5 bottom-[calc(5rem+env(safe-area-inset-bottom))] flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-3xl leading-none text-white shadow-lg"
        aria-label="新增一筆支出"
        @click="openCreate"
      >
        ＋
      </button>
    </div>

    <TabBar :active="activeTab" @change="activeTab = $event" />

    <RecordForm
      :open="isFormOpen"
      :record="editingRecord"
      @save="onSave"
      @delete="onDelete"
      @close="closeForm"
    />
  </div>
</template>
