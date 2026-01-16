<script setup>
import { inject } from 'vue'
import { MapPin, LogOut, Wifi, WifiOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
    isConnected: {
        type: Boolean,
        default: false
    }
})

const router = useRouter()
const myUserName = inject('myUserName', '나') // Chat.vue에서 provide한 값

const goBack = () => {
    // 라우터가 있으면 메인으로, 없으면 그냥 알림
    if (router) router.push('/main')
    else alert('나가기 버튼 클릭')
}
</script>

<template>
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 shrink-0">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin class="w-6 h-6" />
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <h2 class="font-bold text-slate-900 text-sm md:text-base">강남역 2번 출구 → 판교역</h2>
                    <!-- 연결 상태 표시 -->
                    <span v-if="isConnected"
                        class="flex items-center text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        <Wifi class="w-3 h-3 mr-1" /> LIVE
                    </span>
                    <span v-else
                        class="flex items-center text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                        <WifiOff class="w-3 h-3 mr-1" /> Disconnected
                    </span>
                </div>
                <p class="text-xs text-slate-400">
                    실시간 채팅방 · <span class="text-indigo-600 font-bold ml-1">{{ myUserName }}</span>님 참여중
                </p>
            </div>
        </div>
        <button @click="goBack" class="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
            <LogOut class="w-5 h-5" />
        </button>
    </div>
</template>