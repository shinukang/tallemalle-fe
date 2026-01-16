<script setup>
import { ref } from 'vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import RideSidebar from '@/components/chat/RideSidebar.vue'
import ProfileModal from '@/components/chat/ProfileModal.vue'

// --- 상태 데이터 ---
// 프로필 모달 상태
const isProfileModalOpen = ref(false)
const currentProfile = ref({})

// 프로필 데이터 (데모용 - Sidebar와 공유)
const userProfiles = {
    'Aiden': {
        name: '에이든', lv: 'LV. 5', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
        meta: '가입 42일째 · 동승 12회', bio: '"매너 있는 동승을 추구합니다."', score: 72
    },
    'Ji-su': {
        name: '지수', lv: 'LV. 8', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su',
        meta: '가입 124일째 · 동승 48회', bio: '"판교역 근처에서 활동해요! 😊"', score: 88
    }
}

// 자식 컴포넌트(ChatPanel, RideSidebar)에서 발생한 이벤트 핸들러
const openProfile = (userId) => {
    if (userProfiles[userId]) {
        currentProfile.value = userProfiles[userId]
        isProfileModalOpen.value = true
    }
}
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <div class="hidden md:block w-20 shrink-0"></div>

        <main class="flex-1 flex gap-6 overflow-hidden h-[calc(100vh-2rem)]">
            <!-- 채팅 패널 -->
            <ChatPanel @open-profile="openProfile" />

            <!-- 사이드바 -->
            <RideSidebar :user-profiles="userProfiles" @open-profile="openProfile" />
        </main>

        <!-- 프로필 모달 컴포넌트 -->
        <ProfileModal 
            :is-open="isProfileModalOpen" 
            :profile="currentProfile" 
            @close="isProfileModalOpen = false" 
        />

    </div>
</template>