<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
    CarFront, Home, MessageCircle, Bell, Megaphone,
    Settings, LogOut, UserPlus, CheckCircle2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 알림 팝업 상태 관리
const showNotifications = ref(false)
const notificationRef = ref(null) // 팝업 요소 참조용
const toggleBtnRef = ref(null)    // 버튼 요소 참조용

// 메뉴 활성화 확인
const isActive = (path) => route.path === path

// 알림 토글 함수
const toggleNotification = () => {
    showNotifications.value = !showNotifications.value
}

// 외부 클릭 감지 (팝업 닫기)
const handleClickOutside = (event) => {
    if (
        showNotifications.value &&
        notificationRef.value &&
        !notificationRef.value.contains(event.target) &&
        toggleBtnRef.value &&
        !toggleBtnRef.value.contains(event.target)
    ) {
        showNotifications.value = false
    }
}

// 라이프사이클 훅: 이벤트 리스너 등록/해제
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// 페이지 이동 시 팝업 닫기
const goToNotifications = () => {
    showNotifications.value = false
    router.push('/notification')
}
</script>

<template>
    <div class="relative h-full z-50">
        <div
            class="glass-panel w-20 h-full rounded-[2.5rem] flex flex-col items-center py-8 pointer-events-auto shrink-0 bg-white/90 border border-white/50 shadow-xl relative z-40">

            <div class="mb-12">
                <div class="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                    <CarFront class="text-white w-6 h-6" />
                </div>
            </div>

            <div class="flex-1 flex flex-col gap-4">
                <RouterLink to="/" class="nav-item p-3 rounded-2xl transition-all"
                    :class="isActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <Home class="w-6 h-6" />
                </RouterLink>

                <RouterLink to="/chat" class="nav-item p-3 rounded-2xl transition-all relative"
                    :class="isActive('/chat') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <MessageCircle class="w-6 h-6" />
                    <span
                        class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </RouterLink>

                <button ref="toggleBtnRef" @click="toggleNotification"
                    class="nav-item p-3 rounded-2xl transition-all relative"
                    :class="showNotifications ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <Bell class="w-6 h-6" />
                    <span
                        class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <RouterLink to="/notice" class="nav-item p-3 rounded-2xl transition-all"
                    :class="isActive('/notice') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <Megaphone class="w-6 h-6" />
                </RouterLink>
            </div>

            <div class="flex flex-col gap-4 items-center">
                <RouterLink to="/setting" class="nav-item p-3 rounded-2xl transition-all"
                    :class="isActive('/setting') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <Settings class="w-6 h-6" />
                </RouterLink>

                <RouterLink to="/mypage"
                    class="w-10 h-10 rounded-full bg-slate-200 border-2 shadow-sm overflow-hidden cursor-pointer hover:border-indigo-400 transition-all"
                    :class="isActive('/mypage') ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-white'">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile"
                        class="w-full h-full object-cover" />
                </RouterLink>

                <button @click="authStore.logout()"
                    class="nav-item p-3 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all mt-2">
                    <LogOut class="w-6 h-6" />
                </button>
            </div>
        </div>

        <div v-if="showNotifications" ref="notificationRef"
            class="absolute left-[100px] top-[220px] w-[320px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-50 flex flex-col gap-4 origin-top-left transition-all">
            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 class="font-bold text-slate-900 text-lg">실시간 알림</h3>
            </div>

            <div class="flex flex-col gap-4 max-h-[300px] overflow-y-auto custom-scroll">
                <div
                    class="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-colors">
                    <div
                        class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <UserPlus class="w-5 h-5" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-indigo-500">동승자 입장</span>
                        <p class="text-sm text-slate-600 leading-snug">
                            <span class="font-bold text-slate-800">박지민</span>님이 파티에 입장했습니다.
                        </p>
                        <span class="text-[10px] text-slate-400">방금 전</span>
                    </div>
                </div>

                <div
                    class="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-colors">
                    <div
                        class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 class="w-5 h-5" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-emerald-500">배차 완료</span>
                        <p class="text-sm text-slate-600 leading-snug">
                            택시가 잡혔습니다!<br />차량 번호를 확인해주세요.
                        </p>
                        <span class="text-[10px] text-slate-400">2분 전</span>
                    </div>
                </div>
            </div>

            <button @click="goToNotifications"
                class="w-full py-3 mt-2 text-xs font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-all">
                전체보기
            </button>
        </div>

    </div>
</template>