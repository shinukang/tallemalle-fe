<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/user'
import { CarFront, Mail, Lock, MessageCircle, AlertCircle } from 'lucide-vue-next'

// 라우터 인스턴스 생성
const router = useRouter()
// 사용자 정보 관리 저장
const authStore = useAuthStore()

const loginForm = reactive({
  email: '',
  password: '',
})

// 카카오 SDK 키 (실제 키로 교체 필요)
const KAKAO_API_KEY = 'f37807b77cb80bec5b35db61d2ad7dba'

onMounted(() => {
  // 카카오 SDK 로드 및 초기화
  if (!window.Kakao) {
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js'
    script.integrity = 'sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_API_KEY)
      }
    }
    document.head.appendChild(script)
  }
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

// email 규칙
const emailRules = () => {
  if (loginForm.email.length < 10) {
    loginInputError.email.errorMessage = '이메일을 입력해주세요.'
    loginInputError.email.isValid = false

    return false
  }

  loginInputError.email.errorMessage = ''
  loginInputError.email.isValid = true
}

// 비밀번호 규칙
const passwordRules = () => {
  if (loginForm.password.length < 8) {
    loginInputError.password.errorMessage = '비밀번호는 8글자 이상 입력해야합니다.'
    loginInputError.password.isValid = false

    return false
  }

  const hasLowerLetter = /[a-z]/.test(loginForm.password)
  const hasNumber = /[0-9]/.test(loginForm.password)
  const hasSpecial = /[!@$]/.test(loginForm.password)

  if (!(hasLowerLetter && hasNumber)) {
    loginInputError.password.errorMessage = '비밀번호는 영문 소문자, 숫자, 특수문자를 모두 포함해야합니다.'
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

  if (res.status == 200) {
    authStore.login(res.data)
    alert('로그인되었습니다.')
    router.push('/main')
    // console.log(authStore.user)
  } else {
    alert('아이디와 비밀번호를 확인해보세요.')
  }
}

const loginWithKakao = () => {
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:5173/auth/kakao/callback', // 로컬 개발 환경용 리다이렉트 URI
    })
  } else {
    alert('카카오 SDK가 아직 로드되지 않았습니다.')
  }
}

const loginWithGoogle = () => {
  alert('구글 로그인은 서버 설정이 필요합니다.')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 font-sans">
    <div class="bg-white w-full max-w-md rounded-[24px] shadow-xl overflow-hidden relative border border-white/50">
        
      <!-- 상단 헤더 -->
      <div class="p-8 pb-4 flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-6">
          <div class="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <CarFront class="text-white w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-indigo-900">탈래말래</h1>
        </div>
        <h2 class="text-2xl font-bold text-slate-900">다시 오셨군요!</h2>
        <p class="text-slate-500 mt-2 text-sm">함께 탈 파트너가 기다리고 있어요.</p>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="px-8 py-4 space-y-4">

        <!-- 이메일 입력 -->
        <div class="flex flex-col">
          <div
            class="relative flex items-center bg-slate-50 border rounded-xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all"
            :class="[
              loginInputError.email.errorMessage ? 'border-red-400' : 'border-slate-200'
            ]"
          >
            <Mail class="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              v-model="loginForm.email"
              @blur="emailRules()"
              type="email"
              placeholder="이메일 주소"
              class="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm placeholder:text-slate-400"
            />
          </div>
          
          <p 
            v-if="loginInputError.email.errorMessage" 
            class="flex items-center text-red-500 text-xs mt-1.5 ml-1 font-medium animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            {{ loginInputError.email.errorMessage }}
          </p>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="flex flex-col">
          <div
            class="relative flex items-center bg-slate-50 border rounded-xl focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all"
            :class="[
              loginInputError.password.errorMessage ? 'border-red-400' : 'border-slate-200'
            ]"
          >
            <Lock class="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              v-model="loginForm.password"
              @blur="passwordRules()"
              type="password"
              placeholder="비밀번호"
              class="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-sm placeholder:text-slate-400"
            />
          </div>
          
          <p 
            v-if="loginInputError.password.errorMessage" 
            class="flex items-center text-red-500 text-xs mt-1.5 ml-1 font-medium animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle class="w-3.5 h-3.5 mr-1" />
            {{ loginInputError.password.errorMessage }}
          </p>

          <div class="flex justify-end">
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


        <!-- 구분선 -->
        <div class="mt-8 space-y-4">
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-3 text-slate-400 font-medium relative z-10"
              >또는 간편 로그인</span
            >
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-100"></div>
            </div>
          </div>

          <!-- 구글 로그인 -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="loginWithGoogle"
              class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <img
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                class="w-4 h-4"
                alt="Google"
              />
              <span class="text-sm font-semibold text-slate-600">Google</span>
            </button>

            <!-- 카카오 로그인 -->
            <button
              type="button"
              @click="loginWithKakao"
              class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-[#FEE500] hover:border-[#FEE500] transition-all active:scale-[0.98] group"
            >
              <MessageCircle class="w-4 h-4 text-[#3C1E1E] fill-current" />
              <span class="text-sm font-semibold text-slate-600 group-hover:text-[#3C1E1E]"
                >Kakao</span
              >
            </button>
          </div>
        </div>
      </form>

      <!-- 하단 안내 -->
      <div class="p-8 pt-4 text-center">
        <p class="text-sm text-slate-500">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="text-indigo-600 font-bold hover:underline ml-1"
            >회원가입</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
