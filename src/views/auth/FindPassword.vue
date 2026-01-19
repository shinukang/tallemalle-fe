<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, ArrowLeft, Mail, MailCheck } from 'lucide-vue-next'
import AuthBaseInput from '@/components/auth/AuthBaseInput.vue'

const router = useRouter()
const email = ref('')
const emailError = ref('') // 에러 메시지 상태 추가
const isModalOpen = ref(false)

const handleFindPassword = () => {
  // 초기화
  emailError.ref = ''

  if (!email.value) {
    emailError.value = '가입한 이메일을 입력해주세요.'
    return
  }

  // 간단한 이메일 형식 체크 (선택 사항)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = '유효한 이메일 형식이 아닙니다.'
    return
  }

  // 성공 모달 띄우기
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 font-sans"
  >
    <div
      class="bg-white w-full max-w-md rounded-[24px] shadow-xl overflow-hidden relative border border-white/50 p-8"
    >
      <button
        @click="router.back()"
        class="absolute top-6 left-6 p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>

      <div class="mt-8 flex flex-col items-center text-center">
        <div
          class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 ring-8 ring-indigo-50/50"
        >
          <Lock class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900">비밀번호 찾기</h2>
        <p class="text-slate-500 mt-2 text-sm leading-relaxed max-w-[250px]">
          가입하신 이메일 주소를 입력해 주시면<br />비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      <form @submit.prevent="handleFindPassword" class="mt-8 space-y-4">
        <AuthBaseInput
          v-model="email"
          label="이메일 주소"
          label-class="text-xs text-slate-400 uppercase"
          type="email"
          placeholder="example@email.com"
          :icon="Mail"
          :error="emailError"
        />

        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4"
        >
          재설정 메일 보내기
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-sm text-slate-500">
          이메일이 기억나지 않나요?
          <button
            @click="alert('고객센터(02-1234-5678)로 문의해주세요.')"
            class="text-indigo-600 font-bold hover:underline ml-1"
          >
            고객센터 문의
          </button>
        </p>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all"
    >
      <div
        class="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div
          class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600"
        >
          <MailCheck class="w-8 h-8" />
        </div>

        <h3 class="text-xl font-bold text-slate-900 mb-2">메일 발송 완료!</h3>
        <p class="text-sm text-slate-500 mb-8 leading-relaxed">
          <span class="font-bold text-indigo-600">{{ email }}</span
          >으로<br />비밀번호 재설정 링크를 보냈습니다.<br />메일함을 확인해주세요.
        </p>

        <button
          @click="router.push('/login')"
          class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>
