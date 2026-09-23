<script setup>
import { Chart as ChartJS, ArcElement } from 'chart.js'
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { formatAmount } from '../utils/format.js'

// Chart.js v4 要自己註冊用得到的部件。這裡只註冊 ArcElement：
// controller 由 vue-chartjs 的 <Doughnut> 自己帶，Tooltip 與 Legend 則刻意不註冊 ——
// 資料全在下面的文字明細裡，tooltip 在手機上要 touch 才出得來，
// legend 也顯示不了金額，兩個都是白背的體積。
ChartJS.register(ArcElement)

// 金額、百分比、顏色、排序都在 utils/stats.js 算好了，這裡只負責畫。
// 沿用其他元件的做法：收 props、不碰資料層。
const props = defineProps({
  stats: { type: Array, required: true },
})

// 從 props 推導，不在元件裡另存一份副本 —— vue-chartjs 收到新的 data 物件才會重畫，
// 「新增一筆後統計同步更新」就是靠這條路徑成立的。
const chartData = computed(() => ({
  labels: props.stats.map((item) => item.name),
  datasets: [
    {
      data: props.stats.map((item) => item.amount),
      backgroundColor: props.stats.map((item) => item.color),
      borderWidth: 0,
    },
  ],
}))

// maintainAspectRatio 關掉、由外層容器決定高度，否則 canvas 會照著寬度長高，
// 375px 的手機上會佔掉整個畫面。
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  animation: { duration: 200 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}
</script>

<template>
  <section class="bg-white px-4 py-5">
    <!--
      canvas 對螢幕閱讀器是空的、文字也選不起來，所以整塊標成 aria-hidden，
      真正的資料來源是下面那張明細表。圖只是幫忙一眼看出比例。
    -->
    <div class="mx-auto h-44 w-44" aria-hidden="true">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <!--
      用 grid + display: contents 把每一列攤平，四個欄寬由整張表共用 ——
      金額欄跟著最長的那筆撐開，各列才對得齊。改用 flex 各列各自分空間的話，
      金額字數不同會讓每列的欄位落點不一樣，整張表就歪了。
    -->
    <ul class="mt-5 grid grid-cols-[0.75rem_1fr_auto_2.25rem] items-center gap-x-3 gap-y-3">
      <li v-for="item in stats" :key="item.id" class="contents">
        <span
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: item.color }"
          aria-hidden="true"
        ></span>

        <span class="text-sm text-slate-600">{{ item.name }}</span>

        <span class="text-right text-sm tabular-nums text-slate-800">
          {{ formatAmount(item.amount) }}
        </span>

        <span class="text-right text-xs tabular-nums text-slate-400">{{ item.percent }}%</span>
      </li>
    </ul>
  </section>
</template>
