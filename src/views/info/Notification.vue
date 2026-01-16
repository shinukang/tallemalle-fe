<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import NotificationHeader from '@/components/notification/NotificationHeader.vue'
import NotificationFilter from '@/components/notification/NotificationFilter.vue'
import NotificationList from '@/components/notification/NotificationList.vue'

// 스토어 연결
const store = useNotificationStore()
const { notifications } = storeToRefs(store)

const activeFilter = ref('all')

const filteredList = computed(() => {
    if (activeFilter.value === 'all') return notifications.value
    return notifications.value.filter(n => n.type === activeFilter.value)
})

// const markAllAsRead = () => {
//     notifications.value.forEach(n => n.isRead = true)
// }

// const markAsRead = (id) => {
//     const item = notifications.value.find(n => n.id === id)
//     if (item) item.isRead = true
// }
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>

        <div class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/95 backdrop-blur border border-white/50 shadow-xl">
            
            <NotificationHeader @markAllRead="store.markAllAsRead" />

            <NotificationFilter v-model="activeFilter" />

            <NotificationList 
                :items="filteredList" 
                @readItem="store.markAsRead" 
            />
            
        </div>
    </div>
</template>