<script setup>
import { formatAmount } from '../utils/format.js'

// 純 CSS 橫條，不引任何圖表函式庫。金額、百分比、排序都在 useRecords 算好了，
// 這裡只負責畫，沿用 RecordList 的做法：收 props、不自己碰資料層。
defineProps({
  stats: { type: Array, required: true },
})

// 金額很小的分類（例如 5000 裡的 10 元）四捨五入是 0%，寬度 0 的橫條看起來像壞掉。
// 文字照實顯示 0%，只有寬度補到看得見。
function barWidth(percent) {
  return `${Math.max(percent, 2)}%`
}
</script>

<template>
  <!--
    每一列都是 grid 的一橫排（li 用 display: contents 把自己攤平），
    四個欄寬因此由整張表共用 —— 金額欄跟著最長的那筆撐開，其餘各列一起變寬。
    改用 flex 各列各自分空間的話，金額字數不同會讓軌道長度不一樣，
    不同分類的橫條就失去可比性，這個元件也就白做了。
  -->
  <ul class="grid grid-cols-[2rem_1fr_auto_2.25rem] items-center gap-2.5 bg-white px-4 py-4">
    <li v-for="item in stats" :key="item.id" class="contents">
      <span class="text-sm text-slate-600">{{ item.name }}</span>

      <span class="h-2 overflow-hidden rounded-full bg-slate-100">
        <span
          class="block h-full rounded-full bg-slate-700"
          :style="{ width: barWidth(item.percent) }"
        ></span>
      </span>

      <span class="text-right text-sm tabular-nums text-slate-800">
        {{ formatAmount(item.amount) }}
      </span>
      <span class="text-right text-xs tabular-nums text-slate-400">{{ item.percent }}%</span>
    </li>
  </ul>
</template>
