<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { Navigation2, Rocket, Loader2 } from 'lucide-vue-next'

/**
 * ==============================================================================
 * 2. CONFIG & PROPS
 * ==============================================================================
 */
const props = defineProps({
    routeInfo: {
        type: String, default: '경로 미지정'
    },
    buttonState: {
        type: Object,
        default: () => ({
            text: '모집 시작', disabled: false
        })
    }
})

/**
 * ==============================================================================
 * 3. METHODS - UI & LOGIC
 * ==============================================================================
 */
// 모집 생성 버튼 클릭 핸들러
const handleOpenCreate = () => {
    if (!props.buttonState.disabled) {
        emit('openCreate')
    }
}

const emit = defineEmits(['openCreate'])
</script>

<template>
    <div
        class="hidden md:flex absolute bottom-8 right-8 z-10 justify-end pointer-events-auto transition-all duration-500 ease-in-out">
        <div
            class="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] flex items-center justify-between gap-12 border border-white/50 shadow-xl w-full max-w-4xl">

            <div class="flex-1 flex items-center gap-6 pl-4">
                <div class="p-3 bg-slate-100 rounded-2xl text-slate-400">
                    <Navigation2 class="w-6 h-6" />
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">경로 정보</span>
                    <span class="text-lg font-bold text-slate-800">{{ routeInfo }}</span>
                </div>
            </div>

            <button @click="handleOpenCreate"
                :class="buttonState.disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600'"
                class="text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl whitespace-nowrap">
                <span>{{ buttonState.text }}</span>
                <Loader2 v-if="buttonState.disabled" class="w-5 h-5 animate-spin" />
                <Rocket v-else class="w-5 h-5" />
            </button>

        </div>
    </div>
</template>