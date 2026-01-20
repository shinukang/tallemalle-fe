<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { MessageCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// 카카오 SDK 키 (실제 키로 교체 필요)
const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_KEY
// 구글 CLIENT 키 (실제 키로 교체 필요)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

let googleTokenClient = null

onMounted(() => {
  // 카카오 초기화
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

  // 구글 로그인 클라이언트 초기화
  const initGoogle = () => {
    if (window.google) {
      googleTokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (response) => {
          if (response.access_token) {
            await fetchGoogleUserInfo(response.access_token)
          }
        },
      })
    } else {
      setTimeout(initGoogle, 500)
    }
  }
  initGoogle()
})

// 구글 사용자 정보 가져오기 및 로그인 처리
const fetchGoogleUserInfo = async (accessToken) => {
  try {
    const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const user = res.data

    // 스토어에 로그인 정보 저장 (백엔드 대용)
    authStore.login({
      name: user.name,
      email: user.email,
      img: user.picture, // 프로필 사진
      type: 'google'
    })

    alert(`${user.name}님 환영합니다!`)
    router.push('/')

  } catch (error) {
    console.error('구글 로그인 에러:', error)
    alert('구글 로그인 중 오류가 발생했습니다.')
  }
}

// 카카오 로그인 버튼 클릭 핸들러
const loginWithKakao = () => {
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Auth.authorize({
      // 배포 환경용 리다이렉트 URI
      // redirectUri: 'https://www.tallemalle.kro.kr/',
      // 로컬 개발 환경용 리다이렉트 URI
      redirectUri: 'http://localhost:5173/',
    })
  } else {
    alert('카카오 SDK가 아직 로드되지 않았습니다.')
  }
}

// 구글 로그인 버튼 클릭 핸들러
const loginWithGoogle = () => {
  if (googleTokenClient) {
    // 팝업창을 띄워 토큰 요청 (로그인 시도)
    googleTokenClient.requestAccessToken()
  } else {
    alert('구글 로그인을 준비 중입니다. 잠시 후 다시 시도해주세요.')
  }
}
</script>

<template>
  <!-- 구분선 -->
  <div class="mt-8 space-y-4">
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-white px-3 text-slate-400 font-medium relative z-10">또는 간편 로그인</span>
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-100"></div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- 구글 로그인 -->
      <button type="button" @click="loginWithGoogle"
        class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
        <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" class="w-4 h-4" alt="Google" />
        <span class="text-sm font-semibold text-slate-600">Google</span>
      </button>

      <!-- 카카오 로그인 -->
      <button type="button" @click="loginWithKakao"
        class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-[#FEE500] hover:border-[#FEE500] transition-all active:scale-95 group">
        <MessageCircle class="w-4 h-4 text-[#3C1E1E] fill-current" />
        <span class="text-sm font-semibold text-slate-600 group-hover:text-[#3C1E1E]">Kakao</span>
      </button>
    </div>
  </div>
</template>
