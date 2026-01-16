<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import NotificationHeader from '@/components/notification/NotificationHeader.vue'
import FilterTabButton from '@/components/notification/FilterTabButton.vue'
import NotificationList from '@/components/notification/NotificationList.vue'

// 스토어 연결
const store = useNotificationStore()
const { notifications } = storeToRefs(store)

// 필터 탭 종류
const filterOptions = [
    { key: 'all', label: '전체' },
    { key: 'matching', label: '매칭' },
    { key: 'payment', label: '결제' },
    { key: 'event', label: '이벤트' }
]

const activeFilter = ref('all')

const filteredList = computed(() => {
    if (activeFilter.value === 'all') return notifications.value
    return notifications.value.filter(n => n.type === activeFilter.value)
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