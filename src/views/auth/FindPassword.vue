<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, ArrowLeft, Mail, MailCheck } from 'lucide-vue-next'

const router = useRouter()
const email = ref('')
const isModalOpen = ref(false)

const handleFindPassword = () => {
    if (!email.value) {
        alert('가입한 이메일을 입력해주세요.')
        return
    }
    // 성공 모달 띄우기
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 font-sans">
        <div
            class="bg-white w-full max-w-md rounded-[24px] shadow-xl overflow-hidden relative border border-white/50 p-8">

            <button @click="router.back()"
                class="absolute top-6 left-6 p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <ArrowLeft class="w-5 h-5" />
            </button>

            <div class="mt-8 flex flex-col items-center text-center">
                <div
                    class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 ring-8 ring-indigo-50/50">
                    <Lock class="w-8 h-8" />
                </div>
                <h2 class="text-2xl font-bold text-slate-900">비밀번호 찾기</h2>
                <p class="text-slate-500 mt-2 text-sm leading-relaxed max-w-[250px]">
                    가입하신 이메일 주소를 입력해 주시면<br />비밀번호 재설정 링크를 보내드립니다.
                </p>
            </div>

            <form @submit.prevent="handleFindPassword" class="mt-8 space-y-4">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-400 uppercase ml-1">이메일 주소</label>
                    <div
                        class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <Mail class="absolute left-4 w-5 h-5 text-slate-400" />
                        <input v-model="email" type="email" placeholder="example@email.com"
                            class="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm font-medium" />
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4">
                    재설정 메일 보내기
                </button>
            </form>

            <div class="mt-8 text-center">
                <p class="text-sm text-slate-500">
                    이메일이 기억나지 않나요?
                    <button @click="alert('고객센터(02-1234-5678)로 문의해주세요.')"
                        class="text-indigo-600 font-bold hover:underline ml-1">고객센터 문의</button>
                </p>
            </div>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
            <div
                class="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div
                    class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                    <MailCheck class="w-8 h-8" />
                </div>

                <h3 class="text-xl font-bold text-slate-900 mb-2">메일 발송 완료!</h3>
                <p class="text-sm text-slate-500 mb-8 leading-relaxed">
                    <span class="font-bold text-indigo-600">{{ email }}</span>으로<br />비밀번호 재설정 링크를 보냈습니다.<br />메일함을
                    확인해주세요.
                </p>

                <button @click="router.push('/login')"
                    class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                    로그인으로 돌아가기
                </button>
            </div>
        </div>
    </div>
</template>