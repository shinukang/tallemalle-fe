<script setup>
import { X } from 'lucide-vue-next'

// 부모에게 받을 데이터
defineProps({
    recruit: Object,    // 선택된 모집글 정보 (없으면 null)
    isOpen: Boolean     // 패널 열림 여부
})

// 부모에게 보낼 신호
const emit = defineEmits(['close', 'join'])
</script>

<template>
    <div class="glass-panel h-full rounded-[2.5rem] flex flex-col pointer-events-auto overflow-hidden transition-all duration-300 ml-4 bg-white/90 backdrop-blur-md border border-white/50 shadow-xl"
        :class="isOpen ? 'w-full md:w-[400px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 pointer-events-none'">
        <div class="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-900 text-lg">상세 정보</h3>
            <button @click="emit('close')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X class="w-6 h-6" />
            </button>
        </div>

        <div v-if="recruit" class="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span
                        class="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
                        {{ recruit.time }} 출발
                    </span>
                    <span class="text-sm font-bold text-slate-500">
                        <span :class="recruit.cur >= recruit.max ? 'text-rose-500' : 'text-indigo-600'">
                            {{ recruit.cur }}
                        </span> / {{ recruit.max }}명
                    </span>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 leading-tight">
                    {{ recruit.start }} → {{ recruit.dest }}
                </h2>
            </div>

            <p class="text-[14px] text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-3xl">
                {{ recruit.desc || '별도의 설명이 없습니다.' }}
            </p>

            <div class="flex flex-wrap gap-2">
                <span v-for="tag in (recruit.tags || [])" :key="tag"
                    class="text-[11px] font-bold border border-slate-100 px-4 py-2 rounded-xl bg-white shadow-sm">
                    {{ tag }}
                </span>
            </div>
        </div>

        <div class="p-8 bg-slate-50/50 border-t border-slate-100">
            <button v-if="recruit && recruit.cur < recruit.max" @click="emit('join')"
                class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl">
                동승 채팅방 입장
            </button>
            <button v-else disabled
                class="w-full bg-slate-300 text-slate-500 font-bold py-5 rounded-2xl cursor-not-allowed">
                모집이 마감되었습니다
            </button>
        </div>
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>