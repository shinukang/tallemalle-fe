<script setup>
import { MapPin, ArrowRight } from 'lucide-vue-next'

// 데이터를 받기 위한 props 정의
defineProps({
  start: String,
  dest: String,
  time: String,
  cost: String,
  people: Number,
})
</script>

<template>
  <div
    class="flex items-center gap-5 p-5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-3xl transition-all cursor-pointer group"
  >
    <div
      class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform"
    >
      <MapPin class="w-6 h-6" />
    </div>
    <div class="flex-1">
      <div class="flex justify-between items-start mb-1">
        <p class="text-sm font-bold text-slate-800">{{ start }} → {{ dest }}</p>
        <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{{
          time
        }}</span>
      </div>
      <div class="flex items-center gap-3">
        <p class="text-xs text-slate-400 font-medium">{{ cost }} 결제 · 동승 {{ people }}명</p>
        <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
        <p class="text-xs text-indigo-500 font-bold italic">정산 완료</p>
      </div>
    </div>
    <ArrowRight
      class="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all"
    />
  </div>
</template>

<style scoped></style>
