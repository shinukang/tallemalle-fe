<script setup>
import { Navigation2, Rocket } from 'lucide-vue-next'

defineProps({
    routeInfo: { type: String, default: '경로 미지정' }
})

const emit = defineEmits(['openCreate'])
</script>

<template>
    <div
        class="hidden md:flex absolute bottom-8 right-8 z-10 justify-end pointer-events-auto transition-all duration-500 ease-in-out">
        <div
            class="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] flex items-center justify-between gap-12 border border-white/50 shadow-xl w-full max-w-4xl">

            <div class="flex-1 flex items-center gap-10 pl-4">
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">경로 정보</span>
                    <div class="flex items-center gap-2 font-bold text-slate-800">
                        <Navigation2 class="w-4 h-4 text-indigo-600" />
                        <span class="truncate max-w-[150px]">{{ routeInfo }}</span>
                    </div>
                </div>
            </div>

            <button @click="emit('openCreate')"
                class="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl whitespace-nowrap">
                <span>모집 시작</span>
                <Rocket class="w-5 h-5" />
            </button>

        </div>
    </div>
</template>