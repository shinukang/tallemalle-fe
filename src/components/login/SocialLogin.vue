<script setup>
import { onMounted } from 'vue'
import { MessageCircle } from 'lucide-vue-next'

// 카카오 SDK 키 (실제 키로 교체 필요)
const KAKAO_API_KEY = 'f37807b77cb80bec5b35db61d2ad7dba'

onMounted(() => {
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
      <button
        type="button"
        @click="loginWithGoogle"
        class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
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
        class="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-[#FEE500] hover:border-[#FEE500] transition-all active:scale-95 group"
      >
        <MessageCircle class="w-4 h-4 text-[#3C1E1E] fill-current" />
        <span class="text-sm font-semibold text-slate-600 group-hover:text-[#3C1E1E]">Kakao</span>
      </button>
    </div>
  </div>
</template>
