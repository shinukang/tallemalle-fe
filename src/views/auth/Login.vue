<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock } from 'lucide-vue-next'
import AuthBaseInput from '../../components/auth/AuthBaseInput.vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import SocialLogin from '@/components/login/SocialLogin.vue'
import api from '@/api/user'

const router = useRouter() // 라우터 인스턴스 생성
const authStore = useAuthStore() // 사용자 정보 관리 저장

const loginForm = reactive({
  email: '',
  password: '',
})

// 입력 값 검증을 위한 변수 저장
const loginInputError = reactive({
  email: {
    errorMessage: null,
    isValid: false,
  },
  password: {
    errorMessage: null,
    isValid: false,
  },
})

// email 규칙 (유효성 검사)
const emailRules = () => {
  if (loginForm.email.length < 0) {
    loginInputError.email.errorMessage = '이메일을 입력해주세요.'
    loginInputError.email.isValid = false

    return false
  }

  loginInputError.email.errorMessage = ''
  loginInputError.email.isValid = true
}

// 비밀번호 규칙 (유효성 검사)
const passwordRules = () => {
  const hasLowerLetter = /[a-z]/.test(loginForm.password)
  const hasNumber = /[0-9]/.test(loginForm.password)
  const hasSpecial = /[!@$]/.test(loginForm.password)

  if (loginForm.password.length < 8) {
    loginInputError.password.errorMessage = '비밀번호는 8글자 이상 입력해야합니다.'
    loginInputError.password.isValid = false

    return false
  }

  if (!(hasLowerLetter && hasNumber && hasSpecial)) {
    loginInputError.password.errorMessage =
      '비밀번호는 영문 소문자, 숫자, 특수문자를 모두 포함해야합니다.'
    loginInputError.password.isValid = false

    return false
  }

  loginInputError.password.errorMessage = ''
  loginInputError.password.isValid = true
}

// email, 비밀번호 둘다 맞게 썼는지 검증
const isFormValid = () => {
  return loginInputError.email.isValid && loginInputError.password.isValid
}

//로그인 처리
const handleLogin = async () => {
  const res = await api.login(loginForm)

  if (!loginForm.email || !loginForm.password) {
    alert('이메일과 비밀번호를 입력해주세요.')
    // return
  }

  if (!loginInputError.email.isValid) {
    loginInputError.email.errorMessage = '이메일을 확인해주세요.'
    // return false
  }

  if (!loginInputError.password.isValid) {
    loginInputError.password.errorMessage = '비밀번호를 확인해주세요.'
    loginInputError.password.isValid = false

    // return false
  }

  // 로그인 결과
  if (res.status == 200) {
    authStore.login(res.data)
    alert('로그인되었습니다.')
    router.push('/main')
    // console.log(authStore.user)
  } else {
    alert('아이디와 비밀번호를 확인해보세요.')
  }
}
</script>

<template>
  <AuthLayout no-footer-background>
    <template #header>
      <h2 class="text-2xl font-bold text-slate-900">다시 오셨군요!</h2>
      <p class="text-slate-500 mt-2 text-sm">함께 탈 파트너가 기다리고 있어요.</p>
    </template>

    <!-- 로그인 폼 -->
    <form @submit.prevent="handleLogin" class="px-8 py-4 space-y-4">
      <!-- 이메일 입력 -->
      <AuthBaseInput
        v-model="loginForm.email"
        type="email"
        placeholder="이메일 주소"
        :icon="Mail"
        :error="loginInputError.email.errorMessage"
        @blur="emailRules"
      />

      <!-- 비밀번호 입력 -->
      <div>
        <AuthBaseInput
          v-model="loginForm.password"
          type="password"
          placeholder="비밀번호"
          :icon="Lock"
          :error="loginInputError.password.errorMessage"
          @blur="passwordRules"
        />
        <div class="flex justify-end mt-1">
          <router-link
            to="/findpassword"
            class="text-xs text-slate-400 hover:text-indigo-600 font-medium py-1"
          >
            비밀번호를 잊으셨나요?
          </router-link>
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <button
        type="submit"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all mt-2 active:scale-[0.98]"
      >
        로그인하기
      </button>

      <!-- 소셜 로그인 -->
      <SocialLogin />
    </form>

    <!-- 하단 안내 -->
    <template #footer>
      <p class="text-sm text-slate-500">
        아직 회원이 아니신가요?
        <router-link to="/signup" class="text-indigo-600 font-bold hover:underline ml-1">
          회원가입
        </router-link>
      </p>
    </template>
  </AuthLayout>
</template>
