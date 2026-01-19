<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useRecruitStore } from '@/stores/recruit'
import { storeToRefs } from 'pinia'
import {
    CarFront, Home, MessageCircle, Bell, Megaphone,
    Settings, LogOut, UserPlus, CheckCircle2, CreditCard, Gift
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const recruitStore = useRecruitStore()

// 채팅 아이콘 클릭 시 실행될 함수
const handleChatClick = () => {
    if (recruitStore.status === 'IDLE') {
        alert("참여 중인 채팅방이 없습니다. 먼저 모집에 참여해주세요!")
        return
    }

    router.push('/chat')
}

// 알림 스토어 연결
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const showNotifications = ref(false)
const notificationRef = ref(null)
const toggleBtnRef = ref(null)

const isActive = (path) => route.path === path

const toggleNotification = () => {
    showNotifications.value = !showNotifications.value
}

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

onMounted(async () => {
    document.addEventListener('click', handleClickOutside)
    // 앱 시작 시 데이터가 비어있으면 가져오기
    if (notifications.value.length === 0) {
        await notificationStore.fetchNotifications()
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const goToNotifications = () => {
    showNotifications.value = false
    router.push('/notification')
}

// 최신 알림 5개 (이미 정렬된 상태라면 slice만)
const recentNotifications = computed(() => {
    // 1. 원본 데이터를 복사([...]) 후 정렬
    const sorted = [...notifications.value].sort((a, b) => {
        // a와 b의 읽음 상태가 같으면? -> 순서 유지 (시간순)
        if (a.isRead === b.isRead) return 0
        // a가 읽음(true)이면? -> 뒤로 보냄(1)
        return a.isRead ? 1 : -1
    })

    // 2. 정렬된 상태에서 상위 5개만 자르기
    return sorted.slice(0, 5)
})

const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
})

// 클릭 시 삭제하지 않고 '읽음 처리'만 함
const handleNotificationClick = (id) => {
    notificationStore.markAsRead(id)
}

// 한글 이름(.name) 추가
const getNotificationStyle = (type) => {
    switch (type) {
        case 'matching':
            return { icon: UserPlus, bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'text-indigo-500', name: '매칭' }
        case 'event':
            return { icon: Gift, bg: 'bg-pink-50', text: 'text-pink-600', label: 'text-pink-500', name: '이벤트' }
        case 'payment':
            return { icon: CreditCard, bg: 'bg-amber-50', text: 'text-amber-600', label: 'text-amber-500', name: '결제' }
        default:
            return { icon: Bell, bg: 'bg-slate-100', text: 'text-slate-500', label: 'text-slate-500', name: '알림' }
    }
}
</script>

<template>
    <div class="relative h-full z-50">
        <div
            class="glass-panel w-20 h-full rounded-[2.5rem] flex flex-col items-center py-8 pointer-events-auto shrink-0 bg-white border border-slate-200 shadow-xl relative z-40">

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

                <a @click.prevent="handleChatClick" class="nav-item p-3 rounded-2xl transition-all relative"
                    :class="isActive('/chat') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <MessageCircle class="w-6 h-6" />
                    <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"
                        v-if="false"></span>
                </a>

                <button ref="toggleBtnRef" @click="toggleNotification"
                    class="nav-item p-3 rounded-2xl transition-all relative" :class="(showNotifications || route.path === '/notification')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'">
                    <Bell class="w-6 h-6" />
                    <span v-if="unreadCount > 0"
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
                <span v-if="unreadCount > 0" class="text-xs font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                    {{ unreadCount }} new
                </span>
            </div>

            <div class="flex flex-col gap-4 max-h-[300px] overflow-y-auto custom-scroll">
                <div v-if="recentNotifications.length === 0" class="text-center py-8 text-slate-400 text-xs">
                    새로운 알림이 없습니다.
                </div>

                <div v-for="item in recentNotifications" :key="item.id" @click="handleNotificationClick(item.id)"
                    class="flex gap-4 items-start group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-colors relative"
                    :class="{ 'opacity-50': item.isRead }">

                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                        :class="[getNotificationStyle(item.type).bg, getNotificationStyle(item.type).text]">
                        <component :is="getNotificationStyle(item.type).icon" class="w-5 h-5" />
                    </div>

                    <div class="flex flex-col gap-1 flex-1">
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-bold" :class="getNotificationStyle(item.type).label">
                                {{ getNotificationStyle(item.type).name }}
                            </span>
                            <span v-if="!item.isRead" class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        </div>

                        <p class="text-sm text-slate-600 leading-snug line-clamp-2">
                            {{ item.content }}
                        </p>
                        <span class="text-[10px] text-slate-400">{{ item.time }}</span>
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