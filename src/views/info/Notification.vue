<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import { AlertCircle, Loader2, RefreshCcw } from 'lucide-vue-next' // ✅ 아이콘 추가 (로딩, 경고, 새로고침)
import NotificationHeader from '@/components/notification/NotificationHeader.vue'
import FilterTabButton from '@/components/notification/FilterTabButton.vue'
import NotificationList from '@/components/notification/NotificationList.vue'

// 스토어 연결
const store = useNotificationStore()
const { notifications } = storeToRefs(store)

// 상태 관리 변수
const isLoading = ref(false)
const isError = ref(false)

// 데이터 로드 함수 (API 에러를 여기서 잡아서 처리)
const loadData = async () => {
    isLoading.value = true
    isError.value = false

    try {
        if (notifications.value.length === 0) {
            await store.fetchNotifications()
        }
    } catch (error) {
        console.error("View에서 에러 감지:", error)
        // 에러 발생 시 상태 변경 -> 에러 화면 표시됨
        isError.value = true
    } finally {
        isLoading.value = false
    }
}

// 화면 켜질 때 실행
onMounted(() => {
    loadData()
})

// 필터 탭 종류
const filterOptions = [
    { key: 'all', label: '전체' },
    { key: 'matching', label: '매칭' },
    { key: 'payment', label: '결제' },
    { key: 'event', label: '이벤트' }
]

const activeFilter = ref('all')

// 리스트 필터링 및 정렬 (읽은 알림은 아래로)
const filteredList = computed(() => {
    // 1. 필터링
    const list = activeFilter.value === 'all'
        ? notifications.value
        : notifications.value.filter(n => n.type === activeFilter.value)

    // 2. 정렬 (안 읽음 = 상단, 읽음 = 하단)
    return [...list].sort((a, b) => {
        if (a.isRead === b.isRead) return 0
        return a.isRead ? 1 : -1
    })
})
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/95 backdrop-blur border border-white/50 shadow-xl">

            <NotificationHeader @markAllRead="store.markAllAsRead" />

            <div class="px-10 py-4 bg-white/50 border-b border-slate-50">
                <div class="max-w-4xl mx-auto flex gap-6">
                    <FilterTabButton v-for="tab in filterOptions" :key="tab.key" :active="activeFilter === tab.key"
                        @click="activeFilter = tab.key">
                        {{ tab.label }}
                    </FilterTabButton>
                </div>
            </div>

            <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 class="w-8 h-8 animate-spin text-indigo-500" />
                <span class="text-sm font-medium">알림을 불러오는 중입니다...</span>
            </div>

            <div v-else-if="isError" class="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
                    <AlertCircle class="w-8 h-8" />
                </div>
                <div class="text-center">
                    <h3 class="text-lg font-bold text-slate-800">데이터를 불러올 수 없습니다</h3>
                    <p class="text-sm text-slate-400 mt-1">네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.</p>
                </div>
                <button @click="loadData"
                    class="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95">
                    <RefreshCcw class="w-4 h-4" />
                    다시 시도
                </button>
            </div>

            <NotificationList v-else :items="filteredList" @readItem="store.markAsRead" />

        </div>
    </div>
</template>