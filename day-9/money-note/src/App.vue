<script setup>
// 這是確認環境可用的暫時畫面，開始實作時整個換掉。
import { version } from 'vue'
</script>

<template>
  <main
    class="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center"
  >
    <h1 class="text-2xl font-bold text-slate-800">Money Note</h1>
    <p class="text-sm text-slate-500">開發環境就緒，尚未實作功能。</p>
    <p class="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600">
      Vue {{ version }}　Tailwind CSS v4
    </p>
  </main>
</template>
