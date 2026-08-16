<script setup>
import { getCategoryName } from '../constants/categories.js'
import { formatAmount, formatMonthDay } from '../utils/format.js'

// 整列可點，點下去開編輯表單。刪除入口不放在列上，在編輯表單裡（SPEC 5.3）。
defineProps({
  records: { type: Array, required: true },
})

// 傳出去的是這筆記錄的 id，不是「畫面上的第幾筆」——
// 這份清單是篩過、排過的，畫面 index 跟儲存陣列的位置對不上。
const emit = defineEmits(['select'])
</script>

<template>
  <ul class="divide-y divide-slate-100 bg-white">
    <!--
      :key 與 select 事件都用 record.id：前者給 Vue 判斷節點重用，後者告訴外層點了哪一筆。
      兩者剛好同一個值，但用途不同，不要因此改成用 index 省事。
      用 <button> 包整列而不是在 <li> 上掛 @click：拿得到原生的觸控區、鍵盤可聚焦。
    -->
    <li v-for="record in records" :key="record.id">
      <button
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-slate-50"
        @click="emit('select', record.id)"
      >
        <span class="w-11 shrink-0 text-sm tabular-nums text-slate-400">
          {{ formatMonthDay(record.date) }}
        </span>
        <span class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {{ getCategoryName(record.category) }}
        </span>
        <span class="min-w-0 flex-1 truncate text-sm text-slate-500">
          {{ record.note }}
        </span>
        <span class="shrink-0 text-sm font-medium tabular-nums text-slate-800">
          {{ formatAmount(record.amount) }}
        </span>
      </button>
    </li>
  </ul>
</template>
