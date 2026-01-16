<script setup>
import { ref } from 'vue'
import { Info } from 'lucide-vue-next'
import RideDetailModal from './RideDetailModal.vue'

const isRideDetailModalOpen = ref(false)
</script>

<template>
    <div @click="isRideDetailModalOpen = true"
        class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] shrink-0 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group relative border border-white/50 shadow-sm">
        <div class="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info class="w-5 h-5 text-indigo-400" />
        </div>
        <h3 class="font-bold text-slate-900 mb-4 text-sm group-hover:text-indigo-600 transition-colors">
            여정 정보
        </h3>
        <div class="space-y-4">
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Start</p>
                    <p class="text-xs font-bold text-slate-700">강남역 2번 출구 앞</p>
                </div>
            </div>
            <div class="ml-0.5 border-l-2 border-dashed border-slate-100 h-6"></div>
            <div class="flex items-start gap-3">
                <div class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                    <p class="text-xs font-bold text-slate-700">판교역 지하철 입구</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 상세 모달 -->
    <RideDetailModal 
        :is-open="isRideDetailModalOpen" 
        @close="isRideDetailModalOpen = false" 
    />
</template>