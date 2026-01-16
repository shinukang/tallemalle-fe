<script setup>
import RideInfoCard from './RideInfoCard.vue'
import MemberList from './MemberList.vue'

// Props로 사용자 프로필 목록 받음
defineProps({
    userProfiles: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['open-profile'])

const requestOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <aside class="w-80 flex flex-col gap-6 h-full overflow-hidden hidden xl:flex">
        
        <!-- 여정 정보 (클릭 시 모달 열림) -->
        <RideInfoCard />

        <!-- 멤버 리스트 -->
        <MemberList 
            :user-profiles="userProfiles" 
            @open-profile="requestOpenProfile" 
        />
        
    </aside>
</template>