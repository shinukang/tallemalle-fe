<script setup>
import MemberListItem from './MemberListItem.vue'

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

// 내 프로필 데이터 (하드코딩된 데이터 분리)
const myProfile = {
    name: '판교동승왕',
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    subText: '매너점수 85점'
}
</script>

<template>
    <div
        class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] flex-1 overflow-y-auto custom-scroll border border-white/50 shadow-sm">
        <h3 class="font-bold text-slate-900 mb-4 text-sm">참여 멤버 <span class="text-indigo-600">(3/4)</span>
        </h3>
        <div class="space-y-4">
            <!-- 내 프로필 -->
            <MemberListItem 
                :name="myProfile.name"
                :img="myProfile.img"
                :sub-text="myProfile.subText"
                :is-me="true"
            />

            <!-- 다른 멤버들 (Loop) -->
            <MemberListItem 
                v-for="(profile, id) in userProfiles" 
                :key="id"
                :name="profile.name"
                :img="profile.img"
                sub-text="프로필 보기"
                @item-click="requestOpenProfile(id)"
            />
        </div>
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>