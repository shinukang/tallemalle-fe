<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound, Lock, CheckCircle2, Check } from 'lucide-vue-next'
import AuthBaseInput from '@/components/auth/AuthBaseInput.vue'
import PasswordLayout from '@/components/auth/PasswordLayout.vue'
import PasswordModal from '@/components/auth/PasswordModal.vue'

const router = useRouter()

// --- 상태 관리 ---
const password = ref('')
const passwordConfirm = ref('')
const isModalOpen = ref(false)

// --- 에러 메시지 상태 ---
const inputError = reactive({
    password: { errorMessage: null },
    confirm: { errorMessage: null }
})

// --- 실시간 유효성 검사 (버튼 활성화용) ---
const isFormValid = computed(() => {
    const hasLower = /[a-z]/.test(password.value)
    const hasNumber = /[0-9]/.test(password.value)
    const hasSpecial = /[!@$]/.test(password.value)
    const isLenValid = password.value.length >= 8

    const isPasswordValid = hasLower && hasNumber && hasSpecial && isLenValid
    const isConfirmValid = password.value === passwordConfirm.value && passwordConfirm.value !== ''

    return isPasswordValid && isConfirmValid
})

// --- 검사 규칙 (Blur 시 호출) ---
const passwordRules = () => {
    const hasLower = /[a-z]/.test(password.value)
    const hasNumber = /[0-9]/.test(password.value)
    const hasSpecial = /[!@$]/.test(password.value)

    if (!password.value) {
        inputError.password.errorMessage = '새 비밀번호를 입력해주세요.'
    } else if (password.value.length < 8) {
        inputError.password.errorMessage = '비밀번호는 8자 이상이어야 합니다.'
    } else if (!(hasLower && hasNumber && hasSpecial)) {
        inputError.password.errorMessage = '영문 소문자, 숫자, 특수문자(!@$)를 포함해야 합니다.'
    } else {
        inputError.password.errorMessage = null
    }
}

const confirmRules = () => {
    if (!passwordConfirm.value) {
        inputError.confirm.errorMessage = '비밀번호 확인을 입력해주세요.'
    } else if (password.value !== passwordConfirm.value) {
        inputError.confirm.errorMessage = '비밀번호가 일치하지 않습니다.'
    } else {
        inputError.confirm.errorMessage = null
    }
}

// --- 비밀번호 재설정 요청 ---
const handleReset = async () => {
    if (!isFormValid.value) return

    try {
        // 성공 시 모달 오픈
        isModalOpen.value = true
    } catch (error) {
        console.error('비밀번호 변경 실패:', error)
        window.alert('변경 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
}
</script>

<template>
    <PasswordLayout
        title="비밀번호 재설정"
        description="새로운 비밀번호를 입력해주세요."
        :icon="KeyRound"
    >
        <form @submit.prevent="handleReset" class="space-y-5">
            <AuthBaseInput 
                v-model="password"
                label="새 비밀번호"
                label-class="text-xs text-slate-400 uppercase"
                type="password"
                placeholder="8자 이상, 소문자/숫자/특수문자 포함"
                :icon="Lock"
                :error="inputError.password.errorMessage"
                @blur="passwordRules"
            />

            <AuthBaseInput 
                v-model="passwordConfirm"
                label="비밀번호 확인"
                label-class="text-xs text-slate-400 uppercase"
                type="password"
                placeholder="비밀번호 재입력"
                :icon="Check"
                :error="inputError.confirm.errorMessage"
                @blur="confirmRules"
            />

            <button 
                type="submit"
                :disabled="!isFormValid"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
                변경 완료
            </button>
        </form>
    </PasswordLayout>

    <PasswordModal
        :is-open="isModalOpen"
        title="변경 완료"
        description="비밀번호가 성공적으로 변경되었습니다.
        새 비밀번호로 로그인해주세요."
        button-text="로그인하러 가기"
        :icon="CheckCircle2"
        icon-class="bg-emerald-100 text-emerald-600"
        @confirm="router.push('/login')"
    />
</template>