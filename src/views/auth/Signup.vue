<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 라우터 사용을 위해 추가
// Lucide 아이콘
import { CarFront, Mail, Lock, Check, User } from 'lucide-vue-next';

// [수정 1] API 모듈 주석 해제 (실제 통신을 위해 필요)
import api from '@/api/user'; 

const router = useRouter(); // [수정 2] 라우터 객체 생성 주석 해제

// --- 상태 관리 ---
const signupForm = reactive({
  email: '',     // 이메일
  name: '',      // 이름
  password: '',  // 비밀번호
});

const passwordConfirm = ref(''); // 비밀번호 확인

// --- 에러 메시지 표시용 상태 ---
const signupInputError = reactive({
  email: { errorMessage: null, isValid: false },
  name: { errorMessage: null, isValid: false },
  password: { errorMessage: null, isValid: false },
});

// --- 실시간 유효성 검사 (Computed) ---
const isFormValid = computed(() => {
  // 1. 이메일 정규식 확인
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(signupForm.email);

  // 2. 이름 확인
  const isNameValid = signupForm.name.trim().length > 0;

  // 3. 비밀번호 복잡도 확인
  const hasLower = /[a-z]/.test(signupForm.password);
  const hasNumber = /[0-9]/.test(signupForm.password);
  const hasSpecial = /[!@$]/.test(signupForm.password);
  const isLenValid = signupForm.password.length >= 8;
  
  const isPasswordValid = hasLower && hasNumber && hasSpecial && isLenValid;

  // 4. 비밀번호 일치 확인
  const isConfirmValid = signupForm.password === passwordConfirm.value && passwordConfirm.value !== '';

  return isEmailValid && isNameValid && isPasswordValid && isConfirmValid;
});

// --- UI 메시지 표시용 ---
const emailRules = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!signupForm.email) {
    signupInputError.email.errorMessage = '이메일을 입력해주세요.';
    signupInputError.email.isValid = false;
  } else if (!emailRegex.test(signupForm.email)) {
    signupInputError.email.errorMessage = '올바른 이메일 형식이 아닙니다.';
    signupInputError.email.isValid = false;
  } else {
    signupInputError.email.errorMessage = null;
    signupInputError.email.isValid = true;
  }
};

const nameRules = () => {
  if (!signupForm.name.trim()) {
    signupInputError.name.errorMessage = '이름을 입력해주세요.';
    signupInputError.name.isValid = false;
  } else {
    signupInputError.name.errorMessage = null;
    signupInputError.name.isValid = true;
  }
};

const passwordRules = () => {
  const hasLower = /[a-z]/.test(signupForm.password);
  const hasNumber = /[0-9]/.test(signupForm.password);
  const hasSpecial = /[!@$]/.test(signupForm.password);

  if (signupForm.password.length < 8) {
    signupInputError.password.errorMessage = '패스워드는 8글자 이상 입력해야합니다.';
    signupInputError.password.isValid = false;
  } else if (!(hasLower && hasNumber && hasSpecial)) {
    signupInputError.password.errorMessage = '비밀번호는 영문 소문자, 숫자, 특수문자(!@$)를 모두 포함해야합니다.';
    signupInputError.password.isValid = false;
  } else {
    signupInputError.password.errorMessage = '';
    signupInputError.password.isValid = true;
  }
};

// --- [수정 3] 회원가입 요청 로직 활성화 ---
const signup = async () => {
  if (!isFormValid.value) return;

  try {
    console.log('회원가입 요청 데이터 전송:', signupForm);

    // 실제 API 호출 (주석 해제됨)
    // 백엔드가 200 OK 또는 201 Created 등을 반환한다고 가정
    const res = await api.signup(signupForm);
    console.log('Signup Response:', res);
    
    // 성공 시 처리 (백엔드 응답 구조에 따라 res.data 또는 res.status 체크)
    if (res.status === 200 || res.status === 201) {
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      // 라우터로 로그인 페이지 이동
      router.push('/login');
    } else {
      // 200 계열이 아닐 경우 에러 처리
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
    
  } catch (error) {
    console.error('회원가입 에러:', error);
    // 에러 메시지가 서버에서 온다면 그 메시지를 보여주는 것이 좋습니다.
    alert('회원가입 중 오류가 발생했습니다.');
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="p-8 pb-4 flex flex-col items-center text-center">
        <div class="flex items-center gap-2 mb-6">
          <div class="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 logo-bounce">
            <CarFront class="text-white w-7 h-7" />
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-indigo-900">
            탈래말래
          </h1>
        </div>
        <h2 class="text-xl font-bold text-slate-800">
          회원가입
        </h2>
        <p class="text-slate-500 mt-2 text-sm">
          간편하게 가입하고 서비스를 이용해보세요.
        </p>
      </div>

      <form class="p-8 pt-4 space-y-5" @submit.prevent="signup">
        
        <!-- 1. 이메일 입력 -->
        <div class="input-group">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            이메일 계정
          </label>
          <div class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all input-focus-within">
            <input 
              v-model="signupForm.email" 
              @blur="emailRules()"
              type="email" 
              placeholder="example@tallemalle.com"
              class="w-full px-4 py-3.5 pl-12 bg-transparent rounded-xl focus:outline-none text-sm"
            />
            <div class="absolute left-4 text-slate-400">
              <Mail class="w-5 h-5" />
            </div>
          </div>
          <p v-if="signupInputError.email.errorMessage" class="text-red-500 text-xs mt-1 ml-1 font-bold">
            {{ signupInputError.email.errorMessage }}
          </p>
        </div>

        <!-- 2. 이름 입력 -->
        <div class="input-group">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            닉네임
          </label>
          <div class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all input-focus-within">
            <input 
              v-model="signupForm.name" 
              @blur="nameRules()"
              type="text" 
              placeholder="이름을 입력해주세요"
              class="w-full px-4 py-3.5 pl-12 bg-transparent rounded-xl focus:outline-none text-sm"
            />
            <div class="absolute left-4 text-slate-400">
              <User class="w-5 h-5" />
            </div>
          </div>
          <p v-if="signupInputError.name.errorMessage" class="text-red-500 text-xs mt-1 ml-1 font-bold">
            {{ signupInputError.name.errorMessage }}
          </p>
        </div>

        <!-- 3. 비밀번호 입력 -->
        <div class="input-group">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            비밀번호
          </label>
          <div class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all input-focus-within">
            <input 
              @blur="passwordRules()" 
              v-model="signupForm.password" 
              type="password" 
              placeholder="비밀번호 입력"
              class="w-full px-4 py-3.5 pl-12 bg-transparent rounded-xl focus:outline-none text-sm"
            />
            <div class="absolute left-4 text-slate-400">
              <Lock class="w-5 h-5" />
            </div>
          </div>
          <p v-if="signupInputError.password.errorMessage" class="text-red-500 text-xs mt-1 ml-1 font-bold">
            {{ signupInputError.password.errorMessage }}
          </p>
        </div>

        <!-- 4. 비밀번호 확인 -->
        <div class="input-group">
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            비밀번호 확인
          </label>
          <div class="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all input-focus-within"
               :class="{'border-red-400 bg-red-50': passwordConfirm && signupForm.password !== passwordConfirm}">
            <input 
              v-model="passwordConfirm" 
              type="password" 
              placeholder="비밀번호 재입력"
              class="w-full px-4 py-3.5 pl-12 bg-transparent rounded-xl focus:outline-none text-sm"
            />
            <div class="absolute left-4 text-slate-400">
              <Check class="w-5 h-5" />
            </div>
          </div>
          <p v-if="passwordConfirm && signupForm.password !== passwordConfirm" class="text-red-500 text-xs mt-1 ml-1 font-bold">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>

        <button 
          :disabled="!isFormValid"
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          <span>가입 완료</span>
          <Check class="w-5 h-5" />
        </button>

      </form>

      <div class="p-6 bg-slate-50 text-center border-t border-slate-100">
        <p class="text-sm text-slate-500">
          이미 계정이 있으신가요?
          <!-- RouterLink를 사용하여 라우팅 처리 -->
          <RouterLink to="/login" class="text-indigo-600 font-bold hover:underline ml-1">
            로그인
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  font-family: "Pretendard", sans-serif;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signup-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(30, 27, 75, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.input-focus-within:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.input-focus-within:focus-within svg {
  color: #4f46e5;
}

.logo-bounce:hover {
  transform: translateY(-3px) rotate(5deg);
  transition: transform 0.3s ease;
}
</style>