<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const isModalOpen = ref(false)

const handleReset = () => {
    if (password.value.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.')
        return
    }
    if (password.value !== confirmPassword.value) {
        alert('비밀번호가 일치하지 않습니다.')
        return
    }

    // 성공 모달 표시
    isModalOpen.value = true
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 font-sans">
        <div
            class="bg-white w-full max-w-md rounded-[24px] shadow-xl overflow-hidden relative border border-white/50 p-8">

            <div class="mt-4 flex flex-col items-center text-center">
                <div
                    class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 ring-8 ring-indigo-50/50">
                    <KeyRound class="w-8 h-8" />
                </div>
                <h2 class="text-2xl font-bold text-slate-900">비밀번호 재설정</h2>
                <p class="text-slate-500 mt-2 text-sm">새로운 비밀번호를 입력해주세요.</p>
            </div>

            <form @submit.prevent="handleReset" class="mt-8 space-y-5">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-400 uppercase ml-1">새 비밀번호</label>
                    <div
                        class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <Lock class="absolute left-4 w-5 h-5 text-slate-400" />
                        <input v-model="password" type="password" placeholder="8자 이상 입력"
                            class="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm" />
                    </div>
                    <p v-if="password && password.length < 8"
                        class="text-xs text-rose-500 ml-1 flex items-center gap-1">
                        <AlertCircle class="w-3 h-3" /> 8자 이상 입력해주세요.
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-400 uppercase ml-1">비밀번호 확인</label>
                    <div
                        class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <CheckCircle2 class="absolute left-4 w-5 h-5 text-slate-400" />
                        <input v-model="confirmPassword" type="password" placeholder="한 번 더 입력"
                            class="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm" />
                    </div>
                    <p v-if="confirmPassword && password !== confirmPassword"
                        class="text-xs text-rose-500 ml-1 flex items-center gap-1">
                        <AlertCircle class="w-3 h-3" /> 비밀번호가 일치하지 않습니다.
                    </p>
                </div>

                <button type="submit"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4">
                    변경 완료
                </button>
            </form>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div class="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
                <div
                    class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <CheckCircle2 class="w-8 h-8" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">변경 완료</h3>
                <p class="text-sm text-slate-500 mb-8">비밀번호가 성공적으로 변경되었습니다.<br />새 비밀번호로 로그인해주세요.</p>
                <button @click="router.push('/login')"
                    class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                    로그인하러 가기
                </button>
            </div>
        </div>
    </div>
</template>