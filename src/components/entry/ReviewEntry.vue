<script setup>
// 1. 필요한 아이콘 컴포넌트를 반드시 임포트해야 합니다.
import { Quote, Star } from 'lucide-vue-next'
defineProps({
  review: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
  >
    <div class="flex items-center gap-3 mb-4">
      <img
        :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.from}`"
        class="w-10 h-10 rounded-full bg-white border"
      />
      <div>
        <p class="text-xs font-bold text-slate-800">{{ review.from }}님</p>
        <p class="text-[10px] text-slate-400">{{ review.departure }} → {{ review.destination }}</p>
      </div>
    </div>

    <Quote class="absolute top-6 right-6 w-4 h-4 text-slate-200" />

    <p class="text-sm text-slate-600 leading-relaxed italic">"{{ review.contents }}"</p>

    <div class="mt-4 flex gap-1">
      <!-- 2. 별을 5개 고정으로 그리고, 점수에 따라 색상을 다르게 입힙니다. -->
      <Star
        v-for="i in 5"
        :key="i"
        class="w-3 h-3"
        :class="i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'"
      />
    </div>
  </div>
</template>

<style scoped>
/* 텍스트가 너무 길어질 경우를 대비해 2줄 제한 스타일 추가 */
p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
