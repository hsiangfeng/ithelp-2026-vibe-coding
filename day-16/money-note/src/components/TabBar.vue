<script setup>
// 底部分頁。兩個分頁而已，不裝 Vue Router —— 目前在哪一頁是 App.vue 的一個 ref。
defineProps({
  active: { type: String, required: true },
})

const emit = defineEmits(['change'])

const TABS = [
  { id: 'records', label: '記帳' },
  { id: 'stats', label: '統計' },
]
</script>

<template>
  <!-- 跟浮動按鈕一樣包在 max-w-md 裡，桌機上才會跟著內容欄置中而不是橫跨整個螢幕。 -->
  <nav
    class="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]"
  >
    <ul class="grid grid-cols-2">
      <li v-for="tab in TABS" :key="tab.id">
        <button
          type="button"
          class="w-full py-3.5 text-sm transition-colors"
          :class="
            active === tab.id ? 'font-medium text-slate-800' : 'text-slate-400 active:bg-slate-50'
          "
          :aria-current="active === tab.id ? 'page' : undefined"
          @click="emit('change', tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>
