<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  start: String,
  dest: String,
  departure: String, // ISO 8601 문자열 (예: "2026-01-08T18:30:00")
  arrival: String,
  cost: String,
  people: Number,
  isDone: Boolean,
})

// 실시간 계산을 위한 현재 시각 상태
const now = ref(new Date())
let timer = null

/**
 * 상대 시간 계산 로직
 * 1. 미래: N일 후 / 오늘 예정 등
 * 2. 과거 (요청 사항 반영):
 * - 12개월 이상 경과: N년 전
 * - 1개월 이상 ~ 12개월 미만 경과: N개월 전
 * - 1개월 미만: N일 전 (오늘인 경우 시간/분 전)
 */
const timeLabel = computed(() => {
  if (!props.departure) return ''

  const departureDate = new Date(props.departure)
  const diffInMs = now.value - departureDate
  const diffInSeconds = Math.floor(diffInMs / 1000)

  // --- 1. 미래 시점 (예약/운행 예정) ---
  if (diffInSeconds < 0) {
    const absSeconds = Math.abs(diffInSeconds)
    const diffInDays = Math.floor(absSeconds / (60 * 60 * 24))
    if (diffInDays === 0) return '오늘 예정'
    if (diffInDays === 1) return '내일 예정'
    return `${diffInDays}일 후`
  }

  // --- 2. 과거 시점 (상대 시간) ---

  // 전체 경과 개월 수 계산
  const totalMonths =
    (now.value.getFullYear() - departureDate.getFullYear()) * 12 +
    (now.value.getMonth() - departureDate.getMonth())

  // 날짜까지 고려하여 정확한 개월 수 조정 (예: 1월 20일 vs 2월 10일이면 아직 1개월 안 된 것)
  let adjustedMonths = totalMonths
  if (now.value.getDate() < departureDate.getDate()) {
    adjustedMonths--
  }

  // 1년 이상 (12개월 이상)
  if (adjustedMonths >= 12) {
    const years = Math.floor(adjustedMonths / 12)
    return `${years}년 전`
  }

  // 1개월 이상 ~ 1년 미만
  if (adjustedMonths >= 1) {
    return `${adjustedMonths}개월 전`
  }

  // 1개월 미만 (일/시간/분 단위)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays >= 1) return `${diffInDays}일 전`
  if (diffInHours >= 1) return `${diffInHours}시간 전`
  if (diffInMinutes >= 1) return `${diffInMinutes}분 전`

  return '방금 전'
})

onMounted(() => {
  // 1분마다 현재 시각을 갱신
  timer = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div
    class="flex items-center gap-5 p-5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-3xl transition-all cursor-pointer group"
  >
    <!-- 상태 아이콘 -->
    <div
      class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
      :class="isDone ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'"
    >
      <MapPin class="w-6 h-6" />
    </div>

    <!-- 텍스트 정보 -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-1 gap-2">
        <p class="text-sm font-bold text-slate-800 truncate text-left">{{ start }} → {{ dest }}</p>
        <span
          class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap"
        >
          {{ timeLabel }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <p class="text-xs text-slate-400 font-medium">{{ cost }} 결제 · 동승 {{ people }}명</p>
        <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
        <p
          class="text-xs font-bold italic"
          :class="isDone ? 'text-indigo-500' : 'text-emerald-500'"
        >
          {{ isDone ? '정산 완료' : '결제 완료' }}
        </p>
      </div>
    </div>

    <!-- 화살표 -->
    <ArrowRight
      class="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all shrink-0"
    />
  </div>
</template>

<style scoped></style>
