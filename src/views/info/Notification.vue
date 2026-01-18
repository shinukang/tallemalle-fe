<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import NotificationHeader from '@/components/notification/NotificationHeader.vue'
import FilterTabButton from '@/components/notification/FilterTabButton.vue'
import NotificationList from '@/components/notification/NotificationList.vue'

// 스토어 연결
const store = useNotificationStore()
const { notifications } = storeToRefs(store)

// 화면이 로드될 때 API 데이터 호출
onMounted(async () => {
    if (notifications.value.length === 0) {
        await store.fetchNotifications()
    }
})

// 필터 탭 종류
const filterOptions = [
    { key: 'all', label: '전체' },
    { key: 'matching', label: '매칭' },
    { key: 'payment', label: '결제' },
    { key: 'event', label: '이벤트' }
]

const activeFilter = ref('all')

const filteredList = computed(() => {
    // 1. 먼저 탭(전체/매칭/이벤트 등)에 따라 필터링
    const list = activeFilter.value === 'all'
        ? notifications.value
        : notifications.value.filter(n => n.type === activeFilter.value)

    // 2. 그 다음 정렬 (안 읽은 게 위로, 읽은 건 아래로)
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

            <NotificationList :items="filteredList" @readItem="store.markAsRead" />

        </div>
    </div>
</template>