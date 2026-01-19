<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router' // 라우터 사용을 위해 추가
import { CarFront, Mail, Lock, Check, User } from 'lucide-vue-next' // Lucide 아이콘
import AuthBaseInput from '../../components/auth/AuthBaseInput.vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import api from '@/api/user'

const router = useRouter() 

// --- 상태 관리 ---
const signupForm = reactive({
  email: '', // 이메일
  name: '', // 이름
  password: '', // 비밀번호
})

const passwordConfirm = ref('') // 비밀번호 확인

// --- 에러 메시지 표시용 상태 ---
const signupInputError = reactive({
  email: { errorMessage: null, isValid: false },
  name: { errorMessage: null, isValid: false },
  password: { errorMessage: null, isValid: false },
})

// --- 실시간 유효성 검사 (Computed) ---
const isFormValid = computed(() => {
  // 1. 이메일 정규식 확인
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = emailRegex.test(signupForm.email)

  // 2. 이름 확인
  const isNameValid = signupForm.name.trim().length > 0

  // 3. 비밀번호 복잡도 확인
  const hasLower = /[a-z]/.test(signupForm.password)
  const hasNumber = /[0-9]/.test(signupForm.password)
  const hasSpecial = /[!@$]/.test(signupForm.password)
  const isLenValid = signupForm.password.length >= 8

  const isPasswordValid = hasLower && hasNumber && hasSpecial && isLenValid

  // 4. 비밀번호 일치 확인
  const isConfirmValid =
    signupForm.password === passwordConfirm.value && passwordConfirm.value !== ''

  return isEmailValid && isNameValid && isPasswordValid && isConfirmValid
})

// --- UI 메시지 표시용 ---
const emailRules = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!signupForm.email) {
    signupInputError.email.errorMessage = '이메일을 입력해주세요.'
    signupInputError.email.isValid = false
  } else if (!emailRegex.test(signupForm.email)) {
    signupInputError.email.errorMessage = '올바른 이메일 형식이 아닙니다.'
    signupInputError.email.isValid = false
  } else {
    signupInputError.email.errorMessage = null
    signupInputError.email.isValid = true
  }
}

const nicknameRules = () => {
  if (!signupForm.name.trim()) {
    signupInputError.name.errorMessage = '닉네임을 입력해주세요.'
    signupInputError.name.isValid = false
  } else {
    signupInputError.name.errorMessage = null
    signupInputError.name.isValid = true
  }
}

const passwordRules = () => {
  const hasLower = /[a-z]/.test(signupForm.password)
  const hasNumber = /[0-9]/.test(signupForm.password)
  const hasSpecial = /[!@$]/.test(signupForm.password)

  if (signupForm.password.length < 8) {
    signupInputError.password.errorMessage = '패스워드는 8글자 이상 입력해야합니다.'
    signupInputError.password.isValid = false
  } else if (!(hasLower && hasNumber && hasSpecial)) {
    signupInputError.password.errorMessage =
      '비밀번호는 영문 소문자, 숫자, 특수문자(!@$)를 모두 포함해야합니다.'
    signupInputError.password.isValid = false
  } else {
    signupInputError.password.errorMessage = ''
    signupInputError.password.isValid = true
  }
}

// --- [수정 3] 회원가입 요청 로직 활성화 ---
const signup = async () => {
  if (!isFormValid.value) return

  try {
    console.log('회원가입 요청 데이터 전송:', signupForm)

    // 실제 API 호출 (주석 해제됨)
    // 백엔드가 200 OK 또는 201 Created 등을 반환한다고 가정
    const res = await api.signup(signupForm)
    console.log('Signup Response:', res)

    // 성공 시 처리 (백엔드 응답 구조에 따라 res.data 또는 res.status 체크)
    if (res.status === 200 || res.status === 201) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      // 라우터로 로그인 페이지 이동
      router.push('/login')
    } else {
      // 200 계열이 아닐 경우 에러 처리
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  } catch (error) {
    console.error('회원가입 에러:', error)
    // 에러 메시지가 서버에서 온다면 그 메시지를 보여주는 것이 좋습니다.
    alert('회원가입 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="signup-page-wrapper">
  <AuthLayout :key="$route.path">
    <template #header>
      <h2 class="text-xl font-bold text-slate-900">회원가입</h2>
      <p class="text-slate-500 mt-2 text-sm">간편하게 가입하고 서비스를 이용해보세요.</p>
    </template>

    <form class="p-8 pt-4 space-y-5" @submit.prevent="signup">
      <!-- 1. 이메일 입력 -->
      <AuthBaseInput
        v-model="signupForm.email"
        label="이메일 계정"
        type="email"
        placeholder="example@tallemalle.com"
        :icon="Mail"
        :error="signupInputError.email.errorMessage"
        @blur="emailRules"
      />

      <!-- 2. 닉네임 입력 -->
      <AuthBaseInput
        v-model="signupForm.name"
        label="닉네임"
        type="text"
        placeholder="닉네임을 입력해주세요"
        :icon="User"
        :error="signupInputError.name.errorMessage"
        @blur="nicknameRules"
      />

      <!-- 3. 비밀번호 입력 -->
      <AuthBaseInput
        v-model="signupForm.password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호 입력"
        :icon="Lock"
        :error="signupInputError.password.errorMessage"
        @blur="passwordRules"
      />

      <!-- 4. 비밀번호 확인 -->
      <AuthBaseInput
        v-model="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 재입력"
        :icon="Check"
        :error="
          passwordConfirm && signupForm.password !== passwordConfirm
            ? '비밀번호가 일치하지 않습니다.'
            : null
        "
      />

      <!-- 5. 회원가입 버튼 -->
      <button
        :disabled="!isFormValid"
        type="submit"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
      >
        <span>가입 완료</span>
        <Check class="w-5 h-5" />
      </button>
    </form>

    <!-- footer -->
    <template #footer>
      <p class="text-sm text-slate-500">
        이미 계정이 있으신가요?
        <!-- RouterLink를 사용하여 라우팅 처리 -->
        <RouterLink to="/login" class="text-indigo-600 font-bold hover:underline ml-1">
          로그인
        </RouterLink>
      </p>
    </template>
  </AuthLayout>
  </div>
</template>


