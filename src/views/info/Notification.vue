<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    Bell, Check, UserPlus, Gift, Car, CreditCard, BellOff, ArrowLeft
} from 'lucide-vue-next'

const router = useRouter()
const activeFilter = ref('all') // 'all' | 'matching' | 'payment' | 'event'

// 알림 데이터 (디자인 시안에 맞춰 데이터 구성)
const notifications = ref([
    {
        id: 1,
        type: 'matching',
        categoryLabel: 'MATCHING',
        title: '동승자 입장',
        content: '박지민님이 파티에 입장했습니다.',
        time: '방금 전',
        isRead: false
    },
    {
        id: 2,
        type: 'event',
        categoryLabel: 'EVENT',
        title: '벚꽃 시즌 한정! 무료 탑승권',
        content: '지금 바로 쿠폰함을 확인하고 봄나들이 지원금을 받으세요.',
        time: '5분 전',
        isRead: false
    },
    {
        id: 3,
        type: 'matching',
        categoryLabel: 'MATCHING',
        title: '매칭이 완료되었습니다!',
        content: '강남역 → 판교역 동승 매칭이 성공했습니다.',
        time: '15분 전',
        isRead: false
    },
    {
        id: 4,
        type: 'payment',
        categoryLabel: 'PAYMENT',
        title: '정산이 완료되었습니다.',
        content: '어제 이용하신 여정의 요금 4,500원이 결제되었습니다.',
        time: '어제',
        isRead: true
    }
])

// 필터링된 리스트 계산
const filteredList = computed(() => {
    if (activeFilter.value === 'all') return notifications.value
    return notifications.value.filter(n => n.type === activeFilter.value)
})

// 기능: 모두 읽음 처리
const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
}

// 기능: 개별 읽음 처리
const markAsRead = (id) => {
    const item = notifications.value.find(n => n.id === id)
    if (item) item.isRead = true
}

// 아이콘 및 스타일 매핑 헬퍼
const getStyle = (type) => {
    switch (type) {
        case 'matching':
            return { icon: UserPlus, bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'text-indigo-500' }
        case 'event':
            return { icon: Gift, bg: 'bg-pink-50', text: 'text-pink-600', label: 'text-pink-500' }
        case 'payment':
            return { icon: CreditCard, bg: 'bg-amber-50', text: 'text-amber-600', label: 'text-amber-500' }
        default:
            return { icon: Bell, bg: 'bg-slate-100', text: 'text-slate-500', label: 'text-slate-500' }
    }
}
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/95 backdrop-blur border border-white/50 shadow-xl">

            <div class="p-10 pb-6 border-b border-slate-50">
                <div class="max-w-4xl mx-auto w-full flex justify-between items-end">
                    <div>
                        <div class="flex items-center gap-2 md:hidden mb-4">
                            <button @click="router.back()"
                                class="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <ArrowLeft class="w-6 h-6" />
                            </button>
                        </div>
                        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">알림 센터</h1>
                        <p class="text-sm text-slate-400 font-medium mt-2">새로운 소식과 활동 내역을 확인하세요.</p>
                    </div>
                    <button @click="markAllAsRead"
                        class="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-1 active:scale-95">
                        <Check class="w-3 h-3" /> 모두 읽음
                    </button>
                </div>
            </div>

            <div class="px-10 py-4 bg-white/50 border-b border-slate-50">
                <div class="max-w-4xl mx-auto flex gap-6">
                    <button v-for="tab in ['all', 'matching', 'payment', 'event']" :key="tab"
                        @click="activeFilter = tab" class="text-sm pb-2 transition-all capitalize relative"
                        :class="activeFilter === tab ? 'font-bold text-indigo-600 border-b-2 border-indigo-600' : 'font-medium text-slate-400 hover:text-slate-600'">
                        {{ tab === 'all' ? '전체' : tab === 'matching' ? '매칭' : tab === 'payment' ? '결제' : '이벤트' }}
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-10 pt-6">
                <div class="max-w-4xl mx-auto w-full space-y-3">

                    <transition-group name="list">
                        <div v-for="item in filteredList" :key="item.id" @click="markAsRead(item.id)"
                            class="notification-item relative bg-white p-6 pl-10 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer group"
                            :class="{ 'read': item.isRead }">

                            <div v-if="!item.isRead" class="unread-dot"></div>

                            <div class="flex items-start gap-4">
                                <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                                    :class="[getStyle(item.type).bg, getStyle(item.type).text]">
                                    <component :is="getStyle(item.type).icon" class="w-5 h-5" />
                                </div>

                                <div class="flex-1">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <span class="text-[10px] font-bold uppercase tracking-tight"
                                                :class="getStyle(item.type).label">
                                                {{ item.categoryLabel || item.type }}
                                            </span>
                                            <h3 class="font-bold text-slate-800 mt-0.5 text-[15px]">{{ item.title }}
                                            </h3>
                                        </div>
                                        <span class="text-[11px] text-slate-300 whitespace-nowrap ml-2">{{ item.time
                                            }}</span>
                                    </div>
                                    <p class="text-sm text-slate-500 mt-1 leading-relaxed">{{ item.content }}</p>
                                </div>
                            </div>
                        </div>
                    </transition-group>

                    <div v-if="filteredList.length === 0"
                        class="py-20 flex flex-col items-center text-center animate-fade-in">
                        <div
                            class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <BellOff class="w-8 h-8" />
                        </div>
                        <p class="text-slate-400 font-medium">새로운 알림이 없습니다.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 커스텀 스크롤바 */
.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

/* 리스트 아이템 애니메이션 & 스타일 */
.notification-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 읽지 않은 알림 호버 효과 */
.notification-item:not(.read):hover {
    background-color: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

/* 읽음 상태 스타일 */
.notification-item.read {
    opacity: 0.6;
    background-color: #ffffff;
    /* 읽은 알림은 흰색 유지 */
}

/* 읽지 않음 뱃지 (파란 점) - HTML과 동일한 위치 */
.unread-dot {
    width: 8px;
    height: 8px;
    background-color: #4f46e5;
    border-radius: 50%;
    position: absolute;
    top: 28px;
    left: 12px;
    z-index: 10;
}

/* 리스트 등장/삭제 애니메이션 (Vue Transition) */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>