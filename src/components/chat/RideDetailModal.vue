<script setup>
/**
 * [파일 설명]
 * 이 파일은 사이드바의 '여정 정보 카드'를 클릭했을 때 뜨는 '상세 정보 모달'입니다.
 * * * 주요 역할:
 * 1. 택시 기사님 정보(차종, 번호판 등)를 보여줍니다.
 * 2. 출발지부터 도착지까지의 경로와 현재 위치를 시각적으로 보여줍니다.
 * 3. 예상 결제 금액과 내 부담금(N분의 1)을 계산해서 보여줍니다.
 */

import { X, Car } from 'lucide-vue-next'

/**
 * Props 정의
 * - isOpen: 모달을 열지 닫을지 결정하는 값 (true: 열림)
 */
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

/**
 * Emits 정의
 * - close: 닫기 버튼을 누르면 부모에게 "닫아주세요"라고 요청합니다.
 */
const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}
</script>

<template>
    <!-- 
      1. 배경 오버레이 (Overlay)
      - 검은색 반투명 배경 (bg-slate-900/60)
      - 배경을 클릭하면(@click="close") 창이 닫힙니다.
    -->
    <div v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        @click="close">
        
        <!-- 
          2. 모달 윈도우 (Content)
          - @click.stop: 모달 내부를 클릭했을 때는 닫히지 않도록 이벤트 전파를 막습니다.
        -->
        <div class="bg-white w-full max-w-[580px] max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            @click.stop>
            
            <!-- (1) 헤더: 제목 + X버튼 -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/90 sticky top-0 z-10">
                <h3 class="text-lg font-bold text-slate-900">탑승 상세 정보</h3>
                <button @click="close"
                    class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- (2) 본문 내용 -->
            <div class="overflow-y-auto custom-scroll p-6 space-y-6 bg-slate-50/50 flex-1">
                
                <!-- A. 기사님 정보 카드 -->
                <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <!-- 기사님 사진 (예시) -->
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Driver"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <span
                                    class="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">개인택시</span>
                                <h4 class="text-lg font-bold text-slate-900 mt-1">김운전 기사님</h4>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-slate-600">소나타 (신형)</p>
                                <p class="text-lg font-black text-indigo-600">34바 1234</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- B. 이동 경로 타임라인 -->
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 class="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">이동 경로</h4>
                    <div class="relative pl-2 space-y-8">
                        <!-- 세로 줄 (타임라인 선) -->
                        <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                        <!-- 출발지 점 -->
                        <div class="relative flex gap-4">
                            <div class="w-5 h-5 rounded-full bg-white border-4 border-emerald-500 z-10 shrink-0"></div>
                            <div>
                                <p class="text-xs font-bold text-slate-400">18:30 출발 예정</p>
                                <p class="text-sm font-bold text-slate-900">강남역 2번 출구</p>
                            </div>
                        </div>

                        <!-- 현재 위치 (자동차 아이콘) -->
                        <div class="relative flex gap-4">
                            <div
                                class="w-5 h-5 rounded-full bg-indigo-600 z-10 shrink-0 flex items-center justify-center shadow-lg shadow-indigo-300">
                                <Car class="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <!-- animate-pulse: 반짝이는 애니메이션 -->
                                <p class="text-xs font-bold text-indigo-600 animate-pulse">현재 이동 중</p>
                                <p class="text-sm font-bold text-slate-900">뱅뱅사거리 부근</p>
                            </div>
                        </div>

                        <!-- 도착지 점 -->
                        <div class="relative flex gap-4">
                            <div class="w-5 h-5 rounded-full bg-white border-4 border-rose-500 z-10 shrink-0"></div>
                            <div>
                                <p class="text-xs font-bold text-slate-400">19:05 도착 예정</p>
                                <p class="text-sm font-bold text-slate-900">판교역 지하철 입구</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- C. 결제 정보 카드 -->
                <div class="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-sm font-bold text-indigo-900">예상 결제 금액</h4>
                        <span
                            class="text-xs bg-white border border-indigo-100 text-indigo-600 px-2 py-1 rounded-lg font-bold">선결제
                            완료</span>
                    </div>
                    <div class="flex justify-between items-end border-b border-indigo-100/50 pb-4 mb-4">
                        <span class="text-slate-500 text-sm">총 택시 요금 (예상)</span>
                        <span class="text-slate-900 font-bold">18,000원</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <span class="text-slate-500 text-sm">나의 부담금 (1/4)</span>
                        <span class="text-2xl font-black text-indigo-600">4,500원</span>
                    </div>
                </div>
            </div>

            <!-- (3) 하단 푸터: 확인 버튼 -->
            <div class="p-6 bg-white border-t border-slate-100">
                <button @click="close"
                    class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg">
                    확인
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 스크롤바 디자인 */
.custom-scroll::-webkit-scrollbar {
    width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}

/* 모달 등장 애니메이션 */
@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
}
</style>