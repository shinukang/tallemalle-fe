<script setup>
import { X } from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
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
        <div class="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6" @click.stop>
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-900">탑승 상세 정보</h3>
                <button @click="close">
                    <X class="w-6 h-6 text-slate-400" />
                </button>
            </div>
            <p class="text-sm text-slate-500 mb-6">여정 상세 정보가 여기에 표시됩니다.</p>
            <button @click="close"
                class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">닫기</button>
        </div>
    </div>
</template>