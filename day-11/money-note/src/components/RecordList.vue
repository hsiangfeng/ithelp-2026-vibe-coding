<script setup>
import { getCategoryName } from '../constants/categories.js'
import { formatAmount, formatMonthDay } from '../utils/format.js'

// 整列可點，點下去開編輯表單。刪除入口不放在列上，在編輯表單裡（SPEC 5.3）。
defineProps({
  records: { type: Array, required: true },
})

// TODO 後面練習用：改成用 id
// 傳出去的是「畫面上的第幾筆」，不是這筆記錄的 id。
const emit = defineEmits(['select'])
</script>

<template>
  <ul class="divide-y divide-slate-100 bg-white">
    <!--
      :key 維持用 record.id —— 那是給 Vue 判斷節點重用的，跟「識別使用者點了哪一筆」
      是兩回事，混在一起會多出一種元件狀態錯位的問題。
      用 <button> 包整列而不是在 <li> 上掛 @click：拿得到原生的觸控區、鍵盤可聚焦。
    -->
    <li v-for="(record, index) in records" :key="record.id">
      <button
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-slate-50"
        @click="emit('select', index)"
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
