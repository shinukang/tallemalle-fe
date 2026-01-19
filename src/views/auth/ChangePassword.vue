<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft, Lock, KeyRound, CheckCircle2, Info, AlertCircle } from 'lucide-vue-next'
import AuthBaseInput from '../../components/signup/AuthBaseInput.vue'

const router = useRouter()
const authStore = useAuthStore()

// 상태 관리
const changePasswordForm = reactive({
  current: '',
  new: '',
  confirm: '',
})

// 에러 메시지 표시용 상태
const passwordInputError = reactive({
  current: {
    errorMessage: null,
    isValid: false,
  },
  new: {
    errorMessage: null,
    isValid: false,
  },
  confirm: {
    errorMessage: null,
    isValid: false,
  },
})

// 비밀번호 유효성 검증
const isFormValid = computed(() => {
  // 현재 비밀번호 맞는지 확인해야 함
  // 비밀번호 복잡도 확인
  const hasLower = /[a-z]/.test(changePasswordForm.new)
  const hasNumber = /[0-9]/.test(changePasswordForm.new)
  const hasSpecial = /[!@$]/.test(changePasswordForm.new)
  const isLenValid = changePasswordForm.new.length >= 8

  const isPasswordValid = hasLower && hasNumber && hasSpecial && isLenValid

  // 비밀번호 일치 확인
  const isConfirmValid =
    changePasswordForm.new === changePasswordForm.confirm && changePasswordForm.confirm !== ''

  return isPasswordValid && isConfirmValid
})

// 비밀번호 규칙
const passwordRules = () => {
  const hasLower = /[a-z]/.test(changePasswordForm.new)
  const hasNumber = /[0-9]/.test(changePasswordForm.new)
  const hasSpecial = /[!@$]/.test(changePasswordForm.new)

  if (changePasswordForm.new.length < 8) {
    passwordInputError.new.errorMessage = '비밀번호는 8글자 이상 입력해야합니다.'
    passwordInputError.new.isValid = false
  } else if (!(hasLower && hasNumber && hasSpecial)) {
    passwordInputError.new.errorMessage =
      '비밀번호는 영문 소문자, 숫자, 특수문자(!@$)를 모두 포함해야합니다.'
    passwordInputError.new.isValid = false
  } else {
    passwordInputError.new.errorMessage = ''
    passwordInputError.new.isValid = true
  }
}

// 비밀번호 재입력 확인 에러메세지
const checkConfirmPassword = () => {
  if (changePasswordForm.confirm && changePasswordForm.new !== changePasswordForm.confirm) {
    passwordInputError.confirm.errorMessage = '새 비밀번호가 일치하지 않습니다.'
    passwordInputError.confirm.isValid = false
  } else {
    passwordInputError.confirm.errorMessage = ''
    passwordInputError.confirm.isValid = true
  }
}

const handleChangePassword = () => {
  if (!changePasswordForm.current || !changePasswordForm.new || !changePasswordForm.confirm) {
    alert('모든 항목을 입력해주세요.')
    return
  }
  if (changePasswordForm.new.length < 8) {
    passwordInputError.new.errorMessage = '패스워드는 8글자 이상 입력해야합니다.'
    passwordInputError.new.isValid = false

    return false
  }
  if (changePasswordForm.confirm && changePasswordForm.new !== changePasswordForm.confirm) {
    passwordInputError.confirm.errorMessage = '새 비밀번호가 일치하지 않습니다.'
    passwordInputError.confirm.isValid = false

    return false
  }

  alert('비밀번호가 성공적으로 변경되었습니다.')
  router.push('/setting')
}
</script>

<template>
  <div class="h-full flex gap-4 p-4 overflow-hidden relative">
    <div class="hidden md:block w-20 shrink-0"></div>

    <div
      class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col bg-white/90 backdrop-blur border border-white/50 shadow-xl"
    >
      <div class="p-8 border-b border-slate-100 flex items-center gap-4">
        <button
          @click="router.back()"
          class="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">비밀번호 변경</h1>
          <p class="text-sm text-slate-400 font-medium mt-1">
            소중한 개인정보 보호를 위해 주기적인 변경을 권장합니다.
          </p>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scroll p-8 flex flex-col items-center">
        <div class="w-full max-w-lg space-y-8 mt-4">
          <AuthBaseInput
            v-model="changePasswordForm.current"
            label="현재 비밀번호"
            type="password"
            variant="settings"
            bg-color="bg-white"
            placeholder="사용 중인 비밀번호를 입력하세요"
            icon-position="right"
            :icon="Lock"
          />

          <div class="h-px bg-slate-100 w-full my-6"></div>

          <div class="space-y-4">
            <AuthBaseInput
              v-model="changePasswordForm.new"
              label="새 비밀번호"
              type="password"
              variant="settings"
              placeholder="새로운 비밀번호 (8자 이상)"
              icon-position="right"
              :icon="KeyRound"
              :error="passwordInputError.new.errorMessage"
              @blur="passwordRules"
            />

            <AuthBaseInput
              v-model="changePasswordForm.confirm"
              label="새 비밀번호 확인"
              type="password"
              variant="settings"
              placeholder="새로운 비밀번호를 한 번 더 입력하세요"
              icon-position="right"
              :icon="CheckCircle2"
              :error="passwordInputError.confirm.errorMessage"
              @blur="checkConfirmPassword"
            />
          </div>

          <div class="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
            <h4 class="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1">
              <Info class="w-3 h-3" /> 비밀번호 설정 규칙
            </h4>
            <ul class="text-xs text-slate-500 space-y-1 list-disc list-inside ml-1">
              <li>영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.</li>
              <li>연속적인 숫자나 생년월일 등 쉬운 비밀번호는 피해주세요.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="p-8 border-t border-slate-100 bg-white/50 flex justify-end gap-3">
        <button
          @click="router.back()"
          class="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
        >
          취소
        </button>
        <button
          :disabled="!isFormValid"
          @click="handleChangePassword"
          class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          비밀번호 변경하기
        </button>
      </div>
    </div>
  </div>
</template>
