<script setup>
import { getCategoryName } from '../constants/categories.js'
import { formatAmount, formatMonthDay } from '../utils/format.js'

// 這次只做唯讀顯示。點擊編輯與刪除入口是「做」清單的第二、三項。
defineProps({
  records: { type: Array, required: true },
})
</script>

<template>
  <ul class="divide-y divide-slate-100 bg-white">
    <li
      v-for="record in records"
      :key="record.id"
      class="flex items-center gap-3 px-4 py-3.5"
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
    </li>
  </ul>
</template>
