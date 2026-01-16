<script setup>
import { X } from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    profile: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="close">
        <div class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" @click.stop>
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <h3 class="font-bold text-slate-900">프로필 정보</h3>
                <button @click="close"
                    class="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X class="w-5 h-5" />
                </button>
            </div>
            <div class="p-8 flex flex-col items-center text-center">
                <div
                    class="w-24 h-24 rounded-[2.2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden mb-5">
                    <img :src="profile.img" alt="profile" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-2xl font-black text-slate-900">{{ profile.name }}</h2>
                <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-bold mt-1 mb-2">{{
                    profile.lv }}</span>
                <p class="text-xs text-slate-400 font-medium">{{ profile.meta }}</p>
                <div class="mt-6 w-full p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 font-medium">
                    {{ profile.bio }}
                </div>

                <button
                    class="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                    @click="close">
                    확인
                </button>
            </div>
        </div>
    </div>
</template>