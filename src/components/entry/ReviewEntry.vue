<script setup>
// Lucide 아이콘을 명시적으로 임포트해야 템플릿에서 인식할 수 있습니다.
import { Quote, Star } from 'lucide-vue-next'

const props = defineProps({
  review: {
    type: Object,
    required: true,
    // 에러 로그의 데이터 구조에 맞춰 기본값 및 필드 참조를 준비합니다.
    default: () => ({
      from: '',
      departure: '',
      destination: '',
      contents: '',
      rating: 5,
    }),
  },
})
</script>

<template>
  <div
    class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all group cursor-pointer"
  >
    <div class="flex items-center gap-3 mb-4">
      <img
        :src="review.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna'"
        class="w-10 h-10 rounded-full bg-white border object-cover"
      />
      <div class="text-left">
        <!-- 'from' 필드 사용 -->
        <p class="text-xs font-bold text-slate-800">{{ review.from }}님</p>
        <!-- 'departure', 'destination' 필드 사용 -->
        <p class="text-[10px] text-slate-400">{{ review.departure }} → {{ review.destination }}</p>
      </div>
    </div>

    <!-- 인용구 아이콘 -->
    <Quote
      class="absolute top-6 right-6 w-4 h-4 text-slate-200 group-hover:text-indigo-200 transition-colors"
    />

    <p class="text-sm text-slate-600 leading-relaxed italic text-left">"{{ review.contents }}"</p>

    <div class="mt-4 flex gap-1">
      <!-- 별점 아이콘 (정상적으로 해결됨) -->
      <Star
        v-for="i in 5"
        :key="i"
        class="w-3 h-3"
        :class="i <= (review.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'"
      />
    </div>
  </div>
</template>

<style scoped></style>
