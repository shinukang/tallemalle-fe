<script setup>
import { ChevronDown } from 'lucide-vue-next'
defineProps({
  question: String,
  answer: String,
  isOpen: Boolean,
})
defineEmits(['toggle'])
</script>

<template>
  <div
    class="faq-item bg-white p-6 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all"
    :class="{ active: isOpen }"
    @click="$emit('toggle')"
  >
    <div class="flex justify-between items-center gap-4">
      <div class="flex gap-4 items-center flex-1">
        <span
          class="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0"
          >Q</span
        >
        <p class="text-[15px] font-bold text-slate-800 leading-snug">{{ question }}</p>
      </div>
      <div class="p-2 bg-slate-50 rounded-full shrink-0">
        <ChevronDown
          :class="[
            'w-4 h-4 text-slate-400 transition-transform duration-300',
            { 'rotate-180 text-indigo-600': isOpen },
          ]"
        />
      </div>
    </div>
    <div class="faq-answer-container" :class="{ 'is-open': isOpen }">
      <div class="faq-answer-content flex gap-4 pl-14 pt-2">
        <div
          class="text-[14px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl w-full"
        >
          {{ answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* FAQ 아코디언 애니메이션 최적화 */
.faq-answer-container {
  display: grid;
  grid-template-rows: 0fr;
  transition:
    grid-template-rows 0.3s ease-out,
    opacity 0.2s;
  opacity: 0;
  overflow: hidden;
}
.faq-answer-container.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 1rem;
}
.faq-answer-content {
  min-height: 0;
}
</style>
