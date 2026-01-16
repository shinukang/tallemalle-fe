<script setup>
import { ref } from 'vue'
import { Image, Camera, MapPin, Smile, PlusCircle, Send } from 'lucide-vue-next'

const emit = defineEmits(['send-message'])

const inputMessage = ref('')
const isPlusMenuOpen = ref(false)

const togglePlusMenu = () => {
    isPlusMenuOpen.value = !isPlusMenuOpen.value
}

const handleSend = () => {
    if (!inputMessage.value.trim()) return
    // 부모에게 입력된 텍스트 전달
    emit('send-message', inputMessage.value)
    inputMessage.value = ''
    // 메시지 전송 후 플러스 메뉴가 열려있다면 닫기 (선택사항)
    isPlusMenuOpen.value = false
}
</script>

<template>
    <div class="relative shrink-0 z-20">
        <!-- 플러스 메뉴 (absolute로 위치 잡음) -->
        <div class="absolute bottom-24 left-6 w-72 bg-white/95 backdrop-blur rounded-[2rem] p-5 z-30 grid grid-cols-4 gap-4 border border-slate-100 shadow-xl transition-all duration-300 origin-bottom-left"
            :class="isPlusMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'">
            <button class="flex flex-col items-center gap-2 group">
                <div
                    class="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Image class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-bold text-slate-500">사진</span>
            </button>
            <button class="flex flex-col items-center gap-2 group">
                <div
                    class="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Camera class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-bold text-slate-500">카메라</span>
            </button>
            <button class="flex flex-col items-center gap-2 group">
                <div
                    class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <MapPin class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-bold text-slate-500">위치</span>
            </button>
            <button class="flex flex-col items-center gap-2 group">
                <div
                    class="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Smile class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-bold text-slate-500">이모지</span>
            </button>
        </div>

        <!-- 입력바 -->
        <div class="p-6 bg-white border-t border-slate-50">
            <div
                class="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.5rem] border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">
                <button @click="togglePlusMenu"
                    class="p-2 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none"
                    :class="{ 'rotate-45 text-indigo-600': isPlusMenuOpen }">
                    <PlusCircle class="w-6 h-6" />
                </button>
                <input v-model="inputMessage" @keyup.enter="handleSend" type="text" placeholder="메시지를 입력하세요..."
                    class="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 py-2" />
                <button @click="handleSend"
                    class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all">
                    <Send class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>