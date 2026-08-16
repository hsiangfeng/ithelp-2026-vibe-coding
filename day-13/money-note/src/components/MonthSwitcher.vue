<script setup>
import { formatAmount } from '../utils/format.js'

// 月份切換 + 該月總額。跟 RecordList、StatsPanel 一樣只收 props、不碰資料層，
// 要切到哪一個月是 useRecords 的事，這裡只負責發出「往前」「往後」「回本月」。
defineProps({
  monthKey: { type: String, required: true },
  total: { type: Number, required: true },
  isCurrentMonth: { type: Boolean, required: true },
})

const emit = defineEmits(['prev', 'next', 'current'])
</script>

<template>
  <header class="px-5 pt-8 pb-6">
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors active:bg-slate-200"
        aria-label="上個月"
        @click="emit('prev')"
      >
        ◀
      </button>

      <!-- 寬度寫死加 tabular-nums：換月時數字寬度一致，左右箭頭才不會被撐開推走。 -->
      <span class="w-[4.5rem] text-center text-sm tabular-nums text-slate-500">
        {{ monthKey }}
      </span>

      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors active:bg-slate-200"
        aria-label="下個月"
        @click="emit('next')"
      >
        ▶
      </button>

      <!--
        看的就是本月時用 invisible 藏起來，不是 v-if —— v-if 會讓這顆按鈕整個不佔空間，
        而它靠 ml-auto 把自己推到最右邊，一消失左右箭頭就會跟著位移（SPEC 5.1
        「隱藏但保留版面空間」）。visibility: hidden 同時擋掉點擊與鍵盤聚焦，
        不用另外加 disabled。
      -->
      <button
        type="button"
        class="ml-auto rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition-colors active:bg-slate-100"
        :class="{ invisible: isCurrentMonth }"
        @click="emit('current')"
      >
        本月
      </button>
    </div>

    <p class="mt-4 text-4xl font-bold tabular-nums text-slate-800">
      {{ formatAmount(total) }}
    </p>
    <!-- 切到別的月份還寫「本月支出」會對不上，跟著換一個字。 -->
    <p class="mt-1.5 text-xs text-slate-400">{{ isCurrentMonth ? '本月支出' : '當月支出' }}</p>
  </header>
</template>
