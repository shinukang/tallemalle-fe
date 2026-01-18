<script setup>
/**
 * [파일 설명]
 * 이 파일은 채팅 패널의 '상단 헤더' 영역입니다.
 * * * 주요 역할:
 * 1. 경로 정보(예: 강남역 -> 판교역)를 표시합니다.
 * 2. 현재 WebSocket 연결 상태(LIVE / Disconnected)를 시각적으로 보여줍니다.
 * 3. '나가기' 버튼을 통해 채팅방을 종료하고 메인으로 돌아갑니다.
 */

import { inject } from 'vue'
import { MapPin, LogOut, Wifi, WifiOff } from 'lucide-vue-next' // 예쁜 아이콘들
import { useRouter } from 'vue-router' // 페이지 이동을 위한 도구

/**
 * Props 정의
 * - isConnected: 부모(ChatPanel -> ChatView)로부터 받은 실시간 연결 상태입니다.
 * 이 값이 true면 초록불(LIVE), false면 빨간불(Disconnected)을 띄웁니다.
 */
const props = defineProps({
    isConnected: {
        type: Boolean,
        default: false
    }
})

// 페이지 이동을 담당하는 라우터 객체 가져오기
const router = useRouter()

/**
 * Inject (데이터 주입 받기)
 * - ChatView.vue(할아버지 컴포넌트)에서 provide('myUserName') 한 값을 여기서 바로 꺼내 씁니다.
 * - Props로 계속 내려받기 귀찮을 때 쓰는 '직통 터널' 같은 기능입니다.
 * - 두 번째 인자 '나'는 만약 값이 없을 때 사용할 기본값(Fallback)입니다.
 */
const myUserName = inject('myUserName', '나') 

/**
 * [이벤트 핸들러] 뒤로 가기 / 나가기
 * - 오른쪽 상단 로그아웃 아이콘을 누르면 실행됩니다.
 */
const goBack = () => {
    // 실제 라우터가 설정되어 있다면 메인 페이지('/main')로 이동
    if (router) {
        router.push('/main')
    } else {
        // 개발 중이라 라우터가 없다면 알림창만 띄움
        alert('나가기 버튼 클릭')
    }
}
</script>

<template>
    <!-- 
      헤더 전체 컨테이너
      - flex justify-between: 왼쪽(정보)과 오른쪽(버튼)을 양 끝으로 벌림
      - shrink-0: 화면이 줄어들어도 헤더 높이는 찌그러지지 않게 고정
    -->
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 shrink-0">
        
        <!-- 왼쪽 영역: 아이콘 + 텍스트 -->
        <div class="flex items-center gap-4">
            
            <!-- 지도 핀 아이콘 박스 -->
            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin class="w-6 h-6" />
            </div>

            <!-- 텍스트 정보 영역 -->
            <div>
                <div class="flex items-center gap-2">
                    <!-- 경로 제목 -->
                    <h2 class="font-bold text-slate-900 text-sm md:text-base">강남역 2번 출구 → 판교역</h2>
                    
                    <!-- 연결 상태 배지 (조건부 렌더링 v-if / v-else) -->
                    <!-- 연결 성공 시: 초록색 LIVE -->
                    <span v-if="isConnected"
                        class="flex items-center text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        <Wifi class="w-3 h-3 mr-1" /> LIVE
                    </span>
                    <!-- 연결 끊김 시: 빨간색 Disconnected -->
                    <span v-else
                        class="flex items-center text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                        <WifiOff class="w-3 h-3 mr-1" /> Disconnected
                    </span>
                </div>
                
                <!-- 부가 정보: 실시간 표시 + 내 닉네임(Inject로 받은 값) -->
                <p class="text-xs text-slate-400">
                    실시간 채팅방 · <span class="text-indigo-600 font-bold ml-1">{{ myUserName }}</span>님 참여중
                </p>
            </div>
        </div>

        <!-- 오른쪽 영역: 나가기 버튼 -->
        <button @click="goBack" class="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
            <LogOut class="w-5 h-5" />
        </button>
    </div>
</template>