<script setup>
import { inject } from 'vue'
import MemberListItem from './MemberListItem.vue'

defineProps({
    userProfiles: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['open-profile'])

// Chat.vue에서 내 이름을 받아옴 (본인 표시용)
const myUserName = inject('myUserName', '익명') 
</script>

<template>
    <div
        class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] flex-1 overflow-y-auto custom-scroll border border-white/50 shadow-sm">
        <h3 class="font-bold text-slate-900 mb-4 text-sm">참여 멤버 <span class="text-indigo-600">(3/4)</span></h3>
        <div class="space-y-4">
            <!-- 내 프로필 -->
            <MemberListItem 
                :name="myUserName"
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                sub-text="매너점수 42점"
                :is-me="true"
            />

            <!-- 다른 멤버들 (Unknown 제외) -->
            <template v-for="(profile, id) in userProfiles" :key="id">
                <MemberListItem 
                    v-if="id !== 'Unknown'"
                    :name="profile.name"
                    :img="profile.img"
                    sub-text="프로필 보기"
                    @item-click="emit('open-profile', id)"
                />
            </template>
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