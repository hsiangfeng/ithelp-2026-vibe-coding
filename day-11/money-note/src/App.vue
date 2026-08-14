<script setup>
import { ref } from 'vue'
import CategoryChart from './components/CategoryChart.vue'
import RecordForm from './components/RecordForm.vue'
import RecordList from './components/RecordList.vue'
import { useRecords } from './composables/useRecords.js'
import { formatAmount } from './utils/format.js'

const { monthKey, monthRecords, monthTotal, categoryStats, addRecord } = useRecords()

const isFormOpen = ref(false)

function onSave(payload) {
  addRecord(payload)
  isFormOpen.value = false
}
</script>

<template>
  <div class="mx-auto flex min-h-dvh max-w-md flex-col bg-slate-50">
    <!-- 月份切換（◀ ▶ 與「本月」按鈕）是「做」清單第 4、5 項，這次固定顯示本月。 -->
    <header class="px-5 pt-10 pb-6">
      <p class="text-sm tabular-nums text-slate-400">{{ monthKey }}</p>
      <p class="mt-1 text-4xl font-bold tabular-nums text-slate-800">
        {{ formatAmount(monthTotal) }}
      </p>
      <p class="mt-1.5 text-xs text-slate-400">本月支出</p>
    </header>

    <!-- 分類佔比與流水清單共用同一個空狀態開關，不會只剩半張圖。 -->
    <main class="flex-1 space-y-2 pb-32">
      <template v-if="monthRecords.length">
        <CategoryChart :stats="categoryStats" />
        <RecordList :records="monthRecords" />
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
        @click="isFormOpen = true"
      >
        ＋
      </button>
    </div>

    <RecordForm :open="isFormOpen" @save="onSave" @close="isFormOpen = false" />
  </div>
</template>
