<script setup>
import { ref, onMounted } from 'vue'
import { CheckCircle, Info } from 'lucide-vue-next'
import SettingPageLayout from '@/components/setting/SettingPageLayout.vue'
import BlockedUserItem from '@/components/setting/BlockedUserItem.vue'
import api from '@/api/block/index.js'
const blockedUsers = ref([])

// FAQ 리스트 가져오기
const getBlockList = async () => {
  try {
    const res = await api.blockList() // API 호출
    // console.log("받아온 차단된 사용자 데이터:", res) 

    blockedUsers.value = res.data || res 
  } catch (error) {
    console.error('차단된 사용자를 불러오는 중 오류 발생:', error)
  }
}

const unblockUser = (id) => {
    if (confirm("이 사용자의 차단을 해제하시겠습니까?")) {
        blockedUsers.value = blockedUsers.value.filter(user => user.id !== id)
    }
}

onMounted(() => {
  getBlockList()
})
</script>

<template>
    <SettingPageLayout 
        title="차단한 사용자 관리" 
        description="차단된 사용자는 나와 매칭되지 않으며 메시지를 보낼 수 없습니다."
    >
        <div class="w-full max-w-3xl">
            <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[100px]">
                <TransitionGroup name="list" tag="div">
                    <BlockedUserItem 
                        v-for="user in blockedUsers" 
                        :key="user.id" 
                        :user="user"
                        @unblock="unblockUser" 
                    />
                </TransitionGroup>

                <div v-if="blockedUsers.length === 0"
                    class="p-10 text-center text-slate-400 flex flex-col items-center">
                    <CheckCircle class="w-8 h-8 mb-3 opacity-50" />
                    <p class="text-sm">차단한 사용자가 없습니다.</p>
                </div>
            </div>

            <div class="mt-6 text-center">
                <p class="text-xs text-slate-400 bg-slate-100/50 inline-flex items-center gap-1 px-4 py-2 rounded-full mx-auto">
                    <Info class="w-3 h-3" /> 차단을 해제하면 즉시 매칭 대상에 포함됩니다.
                </p>
            </div>
        </div>
    </SettingPageLayout>
</template>

<style scoped>
/* 리스트 삭제 애니메이션 유지 */
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>