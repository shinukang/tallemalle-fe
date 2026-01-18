<script setup>
/**
 * [파일 설명]
 * 이 파일은 사용자 프로필을 클릭했을 때 뜨는 '상세 정보 팝업(모달)' 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 화면 중앙에 팝업창을 띄우고, 배경을 흐리게(Backdrop blur) 처리합니다.
 * 2. 부모에게서 받은 사용자 정보(이름, 점수, 후기 등)를 예쁘게 보여줍니다.
 * 3. 사용자 차단 및 닫기 기능을 제공합니다.
 */

import { ref } from 'vue'
import { X, UserCheck, Ban, BarChart3, MessageSquare } from 'lucide-vue-next' // 아이콘들

/**
 * Props 정의
 * - isOpen: 모달을 보여줄지 말지 결정하는 스위치 (true: 보임, false: 숨김)
 * - profile: 화면에 표시할 사용자 데이터 객체 (기본값 설정 포함)
 */
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    profile: {
        type: Object,
        default: () => ({
            name: '',
            lv: '',
            meta: '',
            bio: '',
            img: '',
            score: 0,
            rank: '',
            isBlocked: false,
            stats: { time: 0, silent: 0 },
            reviews: []
        })
    }
})

/**
 * Emits 정의
 * - close: 닫기 버튼이나 배경을 눌렀을 때 "창 닫아줘"라고 부모에게 요청
 * - toggle-block: 차단 버튼을 눌렀을 때 "이 사람 차단해줘"라고 요청
 */
const emit = defineEmits(['close', 'toggle-block'])

/**
 * 리뷰 펼치기/접기 상태 변수
 * - false: 기본값. 리뷰가 많으면 일부만 보여줌.
 * - true: '전체보기'를 누르면 모든 리뷰를 보여줌.
 */
const reviewsExpanded = ref(false)

/**
 * [기능 함수] 창 닫기
 */
const close = () => {
    emit('close')
}

/**
 * [기능 함수] 차단하기/해제하기
 */
const toggleBlock = () => {
    emit('toggle-block')
}
</script>

<template>
    <!-- 
      1. 모달 오버레이 (배경)
      - v-if="isOpen": 이 값이 true일 때만 화면에 나타납니다.
      - fixed inset-0: 화면 전체를 덮습니다.
      - bg-slate-900/60 backdrop-blur-sm: 배경을 검게 깔고 흐리게 만듭니다.
      - z-[100]: 다른 모든 요소보다 맨 위에 뜹니다.
      - @click="close": 배경(어두운 부분)을 클릭하면 창이 닫힙니다.
    -->
    <div v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity"
        @click="close">
        
        <!-- 
          2. 모달 박스 (하얀 창)
          - @click.stop: 이벤트 전파 방지. 이 박스를 클릭했을 때는 닫히지 않게 막습니다.
          - animate-slide-up: 아래에서 위로 부드럽게 올라오는 애니메이션 적용 (style 참조)
        -->
        <div class="bg-white w-full max-w-[580px] max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            @click.stop>
            
            <!-- (1) 모달 헤더 (제목 + 버튼들) -->
            <!-- sticky top-0: 스크롤을 내려도 헤더는 위에 고정됩니다. -->
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 class="font-bold text-slate-900">프로필 정보</h3>
                <div class="flex items-center gap-2">
                    
                    <!-- 차단 버튼 -->
                    <!-- :class -> 차단 상태(isBlocked)에 따라 빨간색/회색으로 색상이 변합니다. -->
                    <button @click="toggleBlock" class="p-2.5 border rounded-xl transition-all"
                        :class="profile.isBlocked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'">
                        <!-- component :is -> 상태에 따라 아이콘 모양(UserCheck/Ban)도 바뀝니다. -->
                        <component :is="profile.isBlocked ? UserCheck : Ban" class="w-5 h-5" />
                    </button>
                    
                    <!-- 닫기 버튼 (X) -->
                    <button @click="close" class="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- (2) 모달 본문 (스크롤 영역) -->
            <div class="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
                
                <!-- A. 기본 프로필 정보 (사진, 이름, 소개) -->
                <div class="flex flex-col items-center text-center">
                    <div
                        class="w-24 h-24 rounded-[2.2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden mb-5">
                        <img :src="profile.img" class="w-full h-full object-cover" />
                    </div>
                    <div class="space-y-1">
                        <div class="flex items-center justify-center gap-2">
                            <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ profile.name }}</h2>
                            <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-bold">{{
                                profile.lv }}</span>
                        </div>
                        <p class="text-xs text-slate-400 font-medium">{{ profile.meta }}</p>
                    </div>
                    <!-- 한줄 소개글 -->
                    <div
                        class="mt-6 w-full max-w-xs p-4 bg-slate-50/80 rounded-2xl text-xs text-slate-600 leading-relaxed font-medium">
                        {{ profile.bio }}
                    </div>
                </div>

                <!-- B. 매너 점수 게이지 바 -->
                <div class="space-y-4">
                    <div class="flex justify-between items-end px-1">
                        <div class="flex items-center gap-1">
                            <span class="text-3xl font-black text-indigo-600 italic">{{ profile.score }}</span>
                            <span class="text-sm font-bold text-slate-300">점</span>
                        </div>
                        <span class="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{{
                            profile.rank }}</span>
                    </div>
                    <!-- 게이지 바 배경 -->
                    <div class="h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                        <!-- 
                           실제 게이지 (Gradient)
                           :style="{ width: ... }" -> 점수(%)만큼 너비를 동적으로 조절합니다.
                           transition-all duration-1000 -> 게이지가 차오르는 애니메이션 효과
                        -->
                        <div class="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-rose-500 transition-all duration-1000 ease-out rounded-full"
                            :style="{ width: `${profile.score}%` }"></div>
                    </div>
                </div>

                <!-- C. 주요 통계 (시간약속, 정숙함 등) -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 class="w-4 h-4 text-indigo-600" />주요 특징
                    </h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div
                            class="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-600">⏰ 시간 약속</span>
                            <span class="text-xs font-black text-indigo-600">{{ profile.stats?.time || 0 }}회</span>
                        </div>
                        <div
                            class="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-600">🤫 정숙한 이동</span>
                            <span class="text-xs font-black text-indigo-600">{{ profile.stats?.silent || 0 }}회</span>
                        </div>
                    </div>
                </div>

                <!-- D. 동승자 후기 (리뷰 목록) -->
                <div class="space-y-4" v-if="profile.reviews && profile.reviews.length > 0">
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare class="w-4 h-4 text-indigo-600" />동승자 후기
                        </h4>
                        <!-- '전체보기' 토글 버튼 (리뷰가 3개 넘을 때만 보임) -->
                        <button v-if="profile.reviews.length > 3" @click="reviewsExpanded = !reviewsExpanded"
                            class="text-[10px] font-bold text-indigo-600 underline">
                            {{ reviewsExpanded ? '접기' : '전체보기' }}
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        <!-- 리뷰 반복 출력 -->
                        <!-- :class="{ 'hidden': ... }" -> 3번째 이후 리뷰는 '접기' 상태일 때 숨깁니다. -->
                        <div v-for="(review, idx) in profile.reviews" :key="idx"
                            class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2"
                            :class="{ 'hidden': idx >= 3 && !reviewsExpanded }">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-bold text-slate-700">{{ review.author }}</span>
                                <span class="text-[9px] text-slate-300">{{ review.date }}</span>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">{{ review.content }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- (3) 하단 푸터 (확인 버튼) -->
            <div class="p-6 bg-white border-t border-slate-50">
                <button @click="close"
                    class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
                    확인
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 커스텀 스크롤바 (조금 더 두껍게) */
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

/* 아래에서 위로 올라오는 애니메이션 정의 */
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