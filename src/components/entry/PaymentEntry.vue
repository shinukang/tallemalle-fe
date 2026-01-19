<script setup>
import { computed } from 'vue'
import { CreditCard, CheckCircle2 } from 'lucide-vue-next'
import RoundBox from '@/components/layout/RoundBox.vue'

const props = defineProps({
  paymentList: {
    type: Array,
    default: () => [],
  },
  defaultPaymentId: {
    type: [String, Number],
    default: 0,
  },
})

const emit = defineEmits(['add-card', 'manage-card'])

// 기본 결제 수단을 최상단으로 올리는 정렬 로직
const sortedList = computed(() => {
  const list = [...props.paymentList]
  return list.sort((a, b) => {
    if (a.id === props.defaultPaymentId) return -1
    if (b.id === props.defaultPaymentId) return 1
    return 0
  })
})

const handleAdd = () => emit('add-card')
const handleManage = (card) => emit('manage-card', card)
</script>

<template>
  <RoundBox padding="32px" class="flex-none">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-bold text-slate-900 flex items-center gap-2 text-left">
        <CreditCard class="w-5 h-5 text-indigo-600" /> 나의 결제 수단
      </h3>
      <button
        @click="handleAdd"
        class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
      >
        카드 추가
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="card in sortedList"
        :key="card.id"
        @click="handleManage(card)"
        class="flex items-center justify-between p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all group"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-7 bg-white/10 rounded flex items-center justify-center text-[8px] font-black italic uppercase"
          >
            {{ card.card_company?.includes('삼성') ? 'AMEX' : 'VISA' }}
          </div>
          <div class="text-left">
            <p class="text-xs font-bold">
              {{ card.card_company }}
              ({{ card.card_number?.split('-').pop() }})
            </p>
            <p class="text-[10px] text-slate-400">
              {{ card.id === defaultPaymentId ? '기본 결제 수단' : '결제 수단' }}
            </p>
          </div>
        </div>
        <CheckCircle2
          v-if="card.id === defaultPaymentId"
          class="w-5 h-5 text-indigo-400 flex-none"
        />
      </div>

      <!-- 데이터가 없을 때 -->
      <div
        v-if="!paymentList || paymentList.length === 0"
        class="flex items-center justify-center p-5 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 text-sm font-bold col-span-full"
      >
        등록된 결제 수단이 없습니다.
      </div>
    </div>
  </RoundBox>
</template>
