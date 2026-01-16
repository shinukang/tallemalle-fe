<script setup>
import { ref, computed } from 'vue'
import NotificationHeader from '@/components/notification/NotificationHeader.vue'
import NotificationFilter from '@/components/notification/NotificationFilter.vue'
import NotificationList from '@/components/notification/NotificationList.vue'

const activeFilter = ref('all')
const notifications = ref([
    { id: 1, type: 'matching', categoryLabel: 'MATCHING', title: '동승자 입장', content: '박지민님이 파티에 입장했습니다.', time: '방금 전', isRead: false },
    { id: 2, type: 'event', categoryLabel: 'EVENT', title: '벚꽃 시즌 한정! 무료 탑승권', content: '지금 바로 쿠폰함을 확인하고 봄나들이 지원금을 받으세요.', time: '5분 전', isRead: false },
    { id: 3, type: 'matching', categoryLabel: 'MATCHING', title: '매칭이 완료되었습니다!', content: '강남역 → 판교역 동승 매칭이 성공했습니다.', time: '15분 전', isRead: false },
    { id: 4, type: 'payment', categoryLabel: 'PAYMENT', title: '정산이 완료되었습니다.', content: '어제 이용하신 여정의 요금 4,500원이 결제되었습니다.', time: '어제', isRead: true }
])

const filteredList = computed(() => {
    if (activeFilter.value === 'all') return notifications.value
    return notifications.value.filter(n => n.type === activeFilter.value)
})

const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
}

const markAsRead = (id) => {
    const item = notifications.value.find(n => n.id === id)
    if (item) item.isRead = true
}
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>
        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/95 backdrop-blur border border-white/50 shadow-xl">
            <NotificationHeader @markAllRead="markAllAsRead" />
            <NotificationFilter v-model="activeFilter" />
            <NotificationList :items="filteredList" @readItem="markAsRead" />
        </div>
    </div>
</template>