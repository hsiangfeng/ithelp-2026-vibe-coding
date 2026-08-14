<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { CATEGORIES } from '../constants/categories.js'
import { today } from '../utils/format.js'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'close'])

const amount = ref('')
const category = ref('')
const date = ref(today())
const note = ref('')
const amountInput = ref(null)

// 金額只收正整數，所以在輸入的當下就把非數字濾掉，不要讓使用者打完才發現存不了。
// 前導零去掉，但單獨一個 "0" 要留著 —— 讓存檔按鈕維持禁用，使用者才看得懂為什麼按不下去。
function onAmountInput(event) {
  amount.value = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
}

// SPEC 只寫了金額為空或 0 要禁用，但分類同樣必填且沒有預設值，
// 不一起擋的話會存進 category 是空字串的記錄。
const canSave = computed(() => Number(amount.value) > 0 && category.value !== '')

// 每次開啟都重置，避免帶著上一筆的殘值。
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    amount.value = ''
    category.value = ''
    date.value = today()
    note.value = ''
    await nextTick()
    amountInput.value?.focus()
  },
)

function onSubmit() {
  if (!canSave.value) return
  emit('save', {
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
    note: note.value.trim(),
  })
}
</script>

<template>
  <Transition name="sheet">
    <div v-if="open" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('close')"></div>

      <form
        class="sheet-panel relative mx-auto w-full max-w-md rounded-t-2xl bg-white px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl"
        @submit.prevent="onSubmit"
      >
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-800">新增</h2>
          <button
            type="button"
            class="-mr-2 px-2 py-1 text-sm text-slate-400"
            @click="emit('close')"
          >
            取消
          </button>
        </div>

        <label class="mb-5 block">
          <span class="mb-1.5 block text-xs text-slate-400">金額</span>
          <div class="flex items-baseline gap-1 border-b-2 border-slate-200 pb-1.5">
            <span class="text-xl text-slate-300">$</span>
            <input
              ref="amountInput"
              :value="amount"
              type="text"
              inputmode="numeric"
              placeholder="0"
              class="w-full bg-transparent text-3xl font-bold tabular-nums text-slate-800 outline-none placeholder:text-slate-200"
              @input="onAmountInput"
            />
          </div>
        </label>

        <div class="mb-5">
          <span class="mb-1.5 block text-xs text-slate-400">分類</span>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="item in CATEGORIES"
              :key="item.id"
              type="button"
              class="rounded-lg py-2.5 text-sm transition-colors"
              :class="
                category === item.id
                  ? 'bg-slate-800 font-medium text-white'
                  : 'bg-slate-100 text-slate-600'
              "
              @click="category = item.id"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <label class="mb-5 block">
          <span class="mb-1.5 block text-xs text-slate-400">日期</span>
          <input
            v-model="date"
            type="date"
            class="w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-800 outline-none"
          />
        </label>

        <label class="mb-6 block">
          <span class="mb-1.5 block text-xs text-slate-400">備註（選填）</span>
          <input
            v-model="note"
            type="text"
            maxlength="50"
            placeholder="例如：全家咖啡"
            class="w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-300"
          />
        </label>

        <button
          type="submit"
          :disabled="!canSave"
          class="w-full rounded-xl bg-slate-800 py-3.5 text-base font-medium text-white transition-colors disabled:bg-slate-200 disabled:text-slate-400"
        >
          存檔
        </button>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
/* bottom sheet 由下往上出現：遮罩淡入，面板滑上來。 */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>
