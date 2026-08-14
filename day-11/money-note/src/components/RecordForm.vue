<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { CATEGORIES } from '../constants/categories.js'
import { today } from '../utils/format.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  // null 就是新增模式。不能寫 required，關閉的當下父層就會把它清成 null。
  record: { type: Object, default: null },
})

const emit = defineEmits(['save', 'close', 'delete'])

const amount = ref('')
const category = ref('')
const date = ref(today())
const note = ref('')
const amountInput = ref(null)

// 開啟當下的快照，之後畫面完全不讀 props.record。
// 直接寫 props.record ? '編輯' : '新增' 的話，關閉時父層立刻把 record 清成 null，
// 而 bottom sheet 還要滑 0.25 秒 —— 使用者會看到標題閃回「新增」、刪除鈕同時消失。
const isEditing = ref(false)
const isConfirmingDelete = ref(false)

// 金額只收正整數，所以在輸入的當下就把非數字濾掉，不要讓使用者打完才發現存不了。
// 前導零去掉，但單獨一個 "0" 要留著 —— 讓存檔按鈕維持禁用，使用者才看得懂為什麼按不下去。
function onAmountInput(event) {
  amount.value = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
}

// SPEC 只寫了金額為空或 0 要禁用，但分類同樣必填且沒有預設值，
// 不一起擋的話會存進 category 是空字串的記錄。
const canSave = computed(() => Number(amount.value) > 0 && category.value !== '')

// 每次開啟都重設：有 record 就帶入原值，沒有就清空，避免帶著上一筆的殘值。
// 只在開啟時跑，關閉時什麼都不做 —— 收合動畫期間畫面要凍在原樣。
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    const record = props.record
    isEditing.value = Boolean(record)
    // 不重設的話，展開確認後點遮罩關掉、再開別筆，會直接看到紅色的刪除鈕。
    isConfirmingDelete.value = false
    // 金額這條路徑上一律是字串（onAmountInput 產出的就是），帶入時也要轉。
    amount.value = record ? String(record.amount) : ''
    category.value = record?.category ?? ''
    date.value = record?.date ?? today()
    note.value = record?.note ?? ''
    await nextTick()
    amountInput.value?.focus()
  },
)

// 離場中的 sheet 還在 DOM 裡而且點得到，連點兩下會送出兩次。
// props.open 在關閉的當下就是 false，不必等動畫，拿它當閘門最準。
function onSubmit() {
  if (!props.open || !canSave.value) return
  emit('save', {
    amount: Number(amount.value),
    category: category.value,
    date: date.value,
    note: note.value.trim(),
  })
}

function onDelete() {
  if (!props.open) return
  emit('delete')
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
          <h2 class="text-base font-bold text-slate-800">{{ isEditing ? '編輯' : '新增' }}</h2>
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

        <!--
          二次確認就地展開，不用 window.confirm() —— 系統對話框在 iOS 上樣式突兀、
          會強制收鍵盤並卡住 sheet 的收合動畫。就地確認讓拇指不用移動位置。
          裡面每一顆都要寫 type="button"，在 <form> 裡預設是 submit，漏寫會變成按刪除卻存檔。
        -->
        <div v-if="isEditing" class="mt-3">
          <button
            v-if="!isConfirmingDelete"
            type="button"
            class="w-full py-3 text-sm text-red-500"
            @click="isConfirmingDelete = true"
          >
            刪除這筆
          </button>
          <div v-else>
            <p class="mb-2 text-center text-sm text-slate-500">確定要刪除這筆嗎？</p>
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-xl bg-slate-100 py-3 text-sm text-slate-600"
                @click="isConfirmingDelete = false"
              >
                取消
              </button>
              <button
                type="button"
                class="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white"
                @click="onDelete"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
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
