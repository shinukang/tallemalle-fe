<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-vue-next'
import api from '@/api/user'
import DriverAuthLayout from '@/components/driver/DriverAuthLayout.vue'
import DriverAuthHeader from '@/components/driver/DriverAuthHeader.vue'
import DriverAuthInput from '@/components/driver/DriverAuthInput.vue'
import DriverAuthButton from '@/components/driver/DriverAuthButton.vue'

const router = useRouter()
const isLoading = ref(false)

const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  role: 'DRIVER',
})

const signupInputError = reactive({
  name: {
    errorMessage: null,
    isValid: false,
  },
  email: {
    errorMessage: null,
    isValid: false,
  },
  password: {
    errorMessage: null,
    isValid: false,
  },
})

const nameRules = () => {
  if (signupForm.name.length < 5) {
    signupInputError.name.errorMessage = 'ID는 5글자 이상 입력해야합니다.'
    signupInputError.name.isValid = false

    return false
  }
  signupInputError.name.errorMessage = ''
  signupInputError.name.isValid = true
}

const passwordRules = () => {
  if (signupForm.password.length < 8) {
    signupInputError.password.errorMessage = '패스워드는 8글자 이상 입력해야합니다.'
    signupInputError.password.isValid = false

    return false
  }

  const hasUpperLetter = /[A-Z]/.test(signupForm.password)
  const hasLowerLetter = /[a-zA-Z]/.test(signupForm.password)
  const hasNumber = /[0-9]/.test(signupForm.password)
  const hasSpecial = /[!@$]/.test(signupForm.password)

  if (!(hasUpperLetter && hasLowerLetter && hasNumber && hasSpecial)) {
    signupInputError.password.errorMessage =
      '패스워드는 영문, 숫자, 특수문자(!@$)를 모두 포함해야합니다.'
    signupInputError.password.isValid = false

    return false
  }

  signupInputError.password.errorMessage = ''
  signupInputError.password.isValid = true
}

const signup = async () => {
  if (!signupInputError.name.isValid) {
    signupInputError.name.errorMessage = 'ID를 확인해주세요.'
    return false
  }
  if (!signupInputError.password.isValid) {
    signupInputError.password.errorMessage = '패스워드를 확인해주세요..'
    return false
  }

  if (!signupForm.email || !signupForm.password || !signupForm.name) {
    alert('이름,이메일,비밀번호를 모두 입력해주세요.')
    return
  }

  isLoading.value = true
  try {
    const res = await api.signup(signupForm)
    console.log('Signup.vue에서 res 변수 :', res)

    alert('회원가입이 완료되었습니다! 로그인 해주세요.')
    router.push('/driverlogin')
  } catch (error) {
    console.error('회원가입 에러:', error)
    alert('회원가입에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <DriverAuthLayout theme="emerald">
    <DriverAuthHeader
      title="파트너 지원하기"
      subtitle="탈래말래의 기사님이 되어주세요 🤝"
      :icon="UserPlus"
      theme="emerald"
    />

    <form @submit.prevent="signup" class="space-y-5">
      <DriverAuthInput
        label="User Name"
        v-model="signupForm.name"
        @blur="nameRules"
        placeholder="사용하실 이름을 입력하세요"
        :error-message="signupInputError.name?.errorMessage"
        :icon="User"
      />

      <DriverAuthInput
        label="Email"
        v-model="signupForm.email"
        placeholder="사용하실 이메일을 입력하세요"
        :error-message="signupInputError.email?.errorMessage"
        :icon="User"
      />

      <DriverAuthInput
        label="Password"
        type="password"
        v-model="signupForm.password"
        @blur="passwordRules"
        placeholder="비밀번호를 설정하세요"
        :error-message="signupInputError.password?.errorMessage"
        :icon="Lock"
      />

      <DriverAuthButton text="가입 신청하기" :is-loading="isLoading" theme-color="emerald" />
    </form>

    <div class="text-center mt-8">
      <p class="text-slate-400 text-sm">
        이미 계정이 있으신가요?
        <RouterLink
          to="/driverlogin"
          class="text-white font-bold underline decoration-emerald-500 ml-1"
        >
          로그인하기
        </RouterLink>
      </p>
    </div>
  </DriverAuthLayout>
</template>
