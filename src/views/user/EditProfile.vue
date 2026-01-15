<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Camera, Send, Info } from 'lucide-vue-next'

const router = useRouter()

// --- 상태 관리 ---
const profileImage = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')
const form = ref({
    nickname: '판교동승왕',
    phone: '010-1234-5678',
    bio: '매일 판교로 출근하는 직장인입니다! 조용히 가는 걸 선호해요.',
    styles: ['style-1', 'style-3', 'style-5'] // 선택된 스타일 ID
})

// 인증 관련 상태
const isPhoneChanged = ref(false)
const isPhoneVerified = ref(true)
const isAuthModalOpen = ref(false)
const authCode = ref('')
const timer = ref(180)
const timerInterval = ref(null)

// --- 메소드 ---
const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => profileImage.value = e.target.result
        reader.readAsDataURL(file)
    }
}

const handlePhoneInput = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "")
    if (val.length > 3 && val.length <= 7) {
        val = val.replace(/(\d{3})(\d{1,4})/, "$1-$2")
    } else if (val.length >= 8) {
        val = val.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")
    }
    form.value.phone = val

    // 변경 감지
    if (val !== '010-1234-5678') { // 실제로는 DB 저장값과 비교
        isPhoneChanged.value = true
        isPhoneVerified.value = false
    } else {
        isPhoneChanged.value = false
        isPhoneVerified.value = true
    }
}

const requestAuth = () => {
    if (form.value.phone.length < 12) {
        alert("휴대폰 번호를 올바르게 입력해주세요.")
        return
    }
    isAuthModalOpen.value = true
    startTimer()
}

const startTimer = () => {
    clearInterval(timerInterval.value)
    timer.value = 180
    timerInterval.value = setInterval(() => {
        timer.value--
        if (timer.value <= 0) {
            clearInterval(timerInterval.value)
            alert("인증 시간이 만료되었습니다.")
            closeAuthModal()
        }
    }, 1000)
}

const closeAuthModal = () => {
    isAuthModalOpen.value = false
    authCode.value = ''
    clearInterval(timerInterval.value)
}

const confirmAuth = () => {
    if (authCode.value === '1234') {
        isPhoneVerified.value = true
        isPhoneChanged.value = false // 인증 완료 상태로 전환
        closeAuthModal()
        alert("인증되었습니다.")
    } else {
        alert("인증번호가 일치하지 않습니다.")
    }
}

const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const handleSave = () => {
    if (!isPhoneVerified.value) {
        alert("휴대폰 번호 인증을 완료해주세요.")
        return
    }
    alert("회원 정보가 성공적으로 수정되었습니다!")
    router.push('/mypage')
}

onUnmounted(() => {
    clearInterval(timerInterval.value)
})
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col bg-white/90 backdrop-blur border border-white/50 shadow-xl relative">
            <div class="p-8 border-b border-slate-100 flex justify-between items-center">
                <div class="flex items-center gap-4">
                    <button @click="router.back()"
                        class="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                        <ArrowLeft class="w-6 h-6" />
                    </button>
                    <div>
                        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">회원 정보 수정</h1>
                        <p class="text-sm text-slate-400 font-medium mt-1">프로필 정보를 변경하고 저장하세요.</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button @click="router.back()"
                        class="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">취소</button>
                    <button @click="handleSave"
                        class="px-8 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                        변경사항 저장
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-2xl mx-auto space-y-10">

                    <div class="flex flex-col items-center">
                        <div class="relative group cursor-pointer">
                            <div
                                class="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 transition-transform group-hover:scale-[1.02]">
                                <img :src="profileImage" class="w-full h-full object-cover" />
                            </div>
                            <label
                                class="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl border-4 border-white cursor-pointer hover:bg-indigo-700 transition-all">
                                <Camera class="w-5 h-5" />
                                <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
                            </label>
                        </div>
                        <p class="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">클릭하여 사진 변경</p>
                    </div>

                    <div class="space-y-6">
                        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span class="w-1.5 h-6 bg-indigo-600 rounded-full"></span>기본 정보
                        </h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="col-span-1 md:col-span-2">
                                <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">닉네임 <span
                                        class="text-indigo-600">*</span></label>
                                <input v-model="form.nickname" type="text"
                                    class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">이름</label>
                                <input type="text" value="홍길동" readonly
                                    class="w-full px-5 py-4 bg-slate-100 text-slate-400 cursor-not-allowed rounded-[1.25rem] text-sm font-semibold outline-none" />
                            </div>

                            <div class="col-span-1 md:col-span-2">
                                <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">휴대폰 번호 <span
                                        class="text-indigo-600">*</span></label>
                                <div class="flex gap-2">
                                    <input :value="form.phone" @input="handlePhoneInput" type="tel" maxlength="13"
                                        class="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                    <button type="button" @click="requestAuth" :disabled="!isPhoneChanged"
                                        class="px-5 text-xs font-bold rounded-[1.25rem] transition-colors whitespace-nowrap min-w-[100px]"
                                        :class="isPhoneChanged ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-400'">
                                        {{ isPhoneChanged ? '인증번호 전송' : '인증 완료' }}
                                    </button>
                                </div>
                            </div>

                            <div class="col-span-1 md:col-span-2">
                                <label class="block text-xs font-bold text-slate-400 mb-2 ml-1">한 줄 소개</label>
                                <textarea v-model="form.bio"
                                    class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 h-24 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6 pb-10">
                        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>동승 스타일 선택
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            <label v-for="tag in ['🤫 조용한 이동 선호', '🎵 음악 감상', '☕ 커피 취식 가능', '💬 대화 선호', '🚭 금연 필수']"
                                :key="tag" class="cursor-pointer group">
                                <input type="checkbox" :value="tag" v-model="form.styles" class="peer hidden" />
                                <span
                                    class="px-5 py-3 border border-slate-100 bg-white rounded-2xl text-xs font-bold text-slate-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 peer-checked:border-indigo-200 hover:border-indigo-200 transition-all block">
                                    {{ tag }}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isAuthModalOpen"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 text-center animate-in fade-in zoom-in-95">
                <div class="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send class="w-6 h-6 text-indigo-600" />
                </div>
                <h3 class="text-lg font-bold text-slate-900">인증번호 발송 완료</h3>
                <p class="text-sm text-slate-500 mt-1">입력하신 번호로 인증번호가 전송되었습니다.</p>

                <div class="mt-6 mb-2">
                    <input v-model="authCode" type="text" placeholder="1234" maxlength="4"
                        class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div class="text-sm font-bold text-rose-500 mb-6">{{ formatTimer(timer) }}</div>

                <div class="flex gap-3">
                    <button @click="closeAuthModal"
                        class="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50">취소</button>
                    <button @click="confirmAuth"
                        class="flex-1 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg">인증하기</button>
                </div>
            </div>
        </div>
    </div>
</template>