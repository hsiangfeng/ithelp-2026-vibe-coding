<script setup>
import CategoryPieChart from './CategoryPieChart.vue'
import { formatAmount } from '../utils/format.js'

// 統計頁的內容。跟其他元件一樣只收 props、不碰資料層 ——
// 數字要算成什麼樣是 utils/stats.js 的事，該算哪個月是 useRecords 的事。
defineProps({
  total: { type: Number, required: true },
  count: { type: Number, required: true },
  stats: { type: Array, required: true },
  isCurrentMonth: { type: Boolean, required: true },
})
</script>

<template>
  <div class="space-y-2">
    <!--
      總額在上方的月份切換列已經有一份，這裡再列一次是刻意的：
      上面那個是切月份時的即時回饋，這裡是跟筆數並列的統計數字，兩者層級不同。
    -->
    <section class="grid grid-cols-2 gap-2 px-4 pt-2">
      <div class="rounded-xl bg-white px-4 py-4">
        <!-- 切到別的月份還寫「本月」會跟正上方的年月矛盾，跟 MonthSwitcher 同一條規則。 -->
        <p class="text-xs text-slate-400">{{ isCurrentMonth ? '本月支出' : '當月支出' }}</p>
        <p class="mt-1.5 text-2xl font-bold tabular-nums text-slate-800">
          {{ formatAmount(total) }}
        </p>
      </div>

      <div class="rounded-xl bg-white px-4 py-4">
        <p class="text-xs text-slate-400">記帳筆數</p>
        <p class="mt-1.5 text-2xl font-bold tabular-nums text-slate-800">
          {{ count }}<span class="ml-1 text-sm font-normal text-slate-400">筆</span>
        </p>
      </div>
    </section>

    <!--
      空資料丟給 Chart.js 會畫出一個沒有任何扇形的空白圓，看起來像壞掉，
      所以這裡擋在元件外面，跟記帳頁的空狀態同一個取向。
    -->
    <CategoryPieChart v-if="stats.length" :stats="stats" />
    <p v-else class="px-6 py-16 text-center text-sm text-slate-400">這個月還沒有可以統計的支出</p>
  </div>
</template>
