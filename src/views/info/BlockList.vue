<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, UserX, CheckCircle, Info } from 'lucide-vue-next'

const router = useRouter()

// 차단된 유저 목록 데이터
const blockedUsers = ref([
    { id: 1, name: '매너없는택시', date: '2025. 11. 20.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AngryUser' },
    { id: 2, name: '약속안지킴', date: '2025. 12. 05.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NoShow' },
    { id: 3, name: '시끄러운사람', date: '2026. 01. 02.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BadManner' },
    { id: 4, name: '광고계정123', date: '2026. 01. 03.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam' }
])

const unblockUser = (id) => {
    if (confirm("이 사용자의 차단을 해제하시겠습니까?")) {
        // 리스트에서 제거 (Vue의 반응성으로 자동 갱신됨)
        blockedUsers.value = blockedUsers.value.filter(user => user.id !== id)
    }
}
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
            <div class="p-8 border-b border-slate-100 flex items-center gap-4">
                <button @click="router.back()"
                    class="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">차단한 사용자 관리</h1>
                    <p class="text-sm text-slate-400 font-medium mt-1">차단된 사용자는 나와 매칭되지 않으며 메시지를 보낼 수 없습니다.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-3xl mx-auto">

                    <div
                        class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[100px]">
                        <TransitionGroup name="list" tag="div">
                            <div v-for="user in blockedUsers" :key="user.id"
                                class="p-5 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                        <img :src="user.img" class="w-full h-full object-cover grayscale opacity-70" />
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-slate-800">{{ user.name }}</h3>
                                        <p class="text-xs text-slate-400 mt-0.5">{{ user.date }} 차단됨</p>
                                    </div>
                                </div>
                                <button @click="unblockUser(user.id)"
                                    class="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                    차단 해제
                                </button>
                            </div>
                        </TransitionGroup>

                        <div v-if="blockedUsers.length === 0"
                            class="p-10 text-center text-slate-400 flex flex-col items-center">
                            <CheckCircle class="w-8 h-8 mb-3 opacity-50" />
                            <p class="text-sm">차단한 사용자가 없습니다.</p>
                        </div>
                    </div>

                    <div class="mt-6 text-center">
                        <p
                            class="text-xs text-slate-400 bg-slate-100/50 inline-block px-4 py-2 rounded-full flex items-center gap-1 mx-auto">
                            <Info class="w-3 h-3" /> 차단을 해제하면 즉시 매칭 대상에 포함됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 리스트 삭제 애니메이션 */
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