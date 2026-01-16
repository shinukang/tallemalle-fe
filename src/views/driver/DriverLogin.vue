<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CarFront, User, Lock, Mail } from 'lucide-vue-next'
import api from '@/api/driver'
import DriverAuthLayout from '@/components/driver/DriverAuthLayout.vue'
import DriverAuthHeader from '@/components/driver/DriverAuthHeader.vue'
import DriverAuthInput from '@/components/driver/DriverAuthInput.vue'
import DriverAuthButton from '@/components/driver/DriverAuthButton.vue'

const router = useRouter()

const autoLogin = ref(false)
const isLoading = ref(false)

const loginForm = reactive({
  name: '',
  email: '',
  password: '',
})

const loginInputError = reactive({
  name: { errorMessage: null, isValid: false },
  email: { errorMessage: null, isValid: false },
  password: { errorMessage: null, isValid: false },
})

const nameRules = () => {
  if (loginForm.name.length < 5) {
    loginInputError.name.errorMessage = 'ID는 5글자 이상 입력해야합니다.'
    loginInputError.name.isValid = false
    return false
  }
  loginInputError.name.errorMessage = ''
  loginInputError.name.isValid = true
}

const emailRules = () => {
  if (!loginForm.email.includes('@')) {
    loginInputError.email.errorMessage = '이메일 형식으로 입력해야합니다.'
    loginInputError.email.isValid = false
    return false
  }
  loginInputError.email.errorMessage = ''
  loginInputError.email.isValid = true
}

const passwordRules = () => {
  if (loginForm.password.length < 8) {
    loginInputError.password.errorMessage = '패스워드는 8글자 이상 입력해야합니다.'
    loginInputError.password.isValid = false
    return false
  }

  const hasUpperLetter = /[A-Z]/.test(loginForm.password)
  const hasLowerLetter = /[a-zA-Z]/.test(loginForm.password)
  const hasNumber = /[0-9]/.test(loginForm.password)
  const hasSpecial = /[!@$]/.test(loginForm.password)

  if (!(hasUpperLetter && hasLowerLetter && hasNumber && hasSpecial)) {
    loginInputError.password.errorMessage =
      '패스워드는 영문, 숫자, 특수문자(!@$)를 모두 포함해야합니다.'
    loginInputError.password.isValid = false
    return false
  }
  loginInputError.password.errorMessage = ''
  loginInputError.password.isValid = true
}

const handleLogin = async () => {
  console.log('🚀 로그인 시도!')

  nameRules()
  emailRules()
  passwordRules()

  if (
    !loginInputError.name.isValid ||
    !loginInputError.email.isValid ||
    !loginInputError.password.isValid
  ) {
    return
  }

  if (!loginForm.name || !loginForm.password || !loginForm.email) {
    alert('모든 정보를 입력해주세요.')
    return
  }

  isLoading.value = true

  try {
    const res = await api.login(loginForm)
    console.log('Login res:', res)

    if (res && res.status == 200) {
      localStorage.setItem('tm_driver_id', loginForm.name)
      alert('로그인 성공! 운행을 시작합니다.')
      router.push('/driverNav/DriverPage')
    } else {
      alert('아이디와 비밀번호를 확인해주세요.')
    }
  } catch (error) {
    console.error('로그인 에러:', error)
    alert('로그인 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <DriverAuthLayout theme="indigo">
    <DriverAuthHeader
      title="기사님 로그인"
      subtitle="오늘도 안전운행 하세요! 🚕"
      :icon="CarFront"
      theme="indigo"
    />

    <form @submit.prevent="handleLogin" class="space-y-5">
      <DriverAuthInput
        label="User Name"
        v-model="loginForm.name"
        @blur="nameRules"
        placeholder="아이디를 입력하세요"
        :error-message="loginInputError.name.errorMessage"
        :icon="User"
      />

      <DriverAuthInput
        label="Email"
        v-model="loginForm.email"
        @blur="emailRules"
        placeholder="이메일을 입력하세요"
        :error-message="loginInputError.email.errorMessage"
        :icon="Mail"
      />

      <DriverAuthInput
        label="Password"
        type="password"
        v-model="loginForm.password"
        @blur="passwordRules"
        placeholder="비밀번호를 입력하세요"
        :error-message="loginInputError.password.errorMessage"
        :icon="Lock"
      />

      <div class="flex items-center justify-between px-1 pt-2">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="autoLogin"
            class="appearance-none w-5 h-5 rounded border border-slate-600 bg-slate-800 checked:bg-indigo-500 checked:border-indigo-500 transition-all"
          />
          <span class="text-sm text-slate-400 group-hover:text-slate-300">자동 로그인</span>
        </label>
        <a href="#" class="text-sm text-indigo-400 font-bold hover:text-indigo-300"
          >비밀번호 찾기</a
        >
      </div>

      <DriverAuthButton text="운행 시작하기" :is-loading="isLoading" theme-color="indigo" />
    </form>

    <div class="text-center mt-8">
      <p class="text-slate-400 text-sm">
        계정이 없으신가요?
        <RouterLink
          to="/driversignup"
          class="text-white font-bold underline decoration-indigo-500 ml-1"
        >
          기사님 지원하기
        </RouterLink>
      </p>
    </div>
  </DriverAuthLayout>
</template>
