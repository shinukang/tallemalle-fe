<script setup>
/**
 * [파일 설명]
 * 이 파일은 사이드바 상단에 위치한 '여정 정보 요약 카드'입니다.
 * * * 주요 역할:
 * 1. 출발지(Start)와 도착지(Destination)를 시각적으로 깔끔하게 보여줍니다.
 * 2. 카드를 클릭하면 상세 정보 모달(RideDetailModal)을 띄웁니다.
 */

import { ref } from 'vue'
import { Info } from 'lucide-vue-next' // 정보(i) 아이콘
import RideDetailModal from './RideDetailModal.vue' // 상세 내용을 보여줄 팝업창

/**
 * 모달 상태 관리 변수
 * - false: 닫힘 (기본값)
 * - true: 열림 (화면에 보임)
 */
const isRideDetailModalOpen = ref(false)
</script>

<template>
    <!-- 
      카드 전체 컨테이너 (클릭 가능 영역)
      - @click="isRideDetailModalOpen = true": 클릭하면 모달 상태를 true로 바꿔서 창을 엽니다.
      - group: 자식 요소들이 부모의 상태(hover 등)에 반응하도록 그룹을 지어줍니다.
      - cursor-pointer: 마우스를 올리면 손가락 모양으로 변해 '클릭 가능함'을 알려줍니다.
    -->
    <div @click="isRideDetailModalOpen = true"
        class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] shrink-0 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group relative border border-white/50 shadow-sm">
        
        <!-- 
          우측 상단 'i' 아이콘
          - opacity-0 group-hover:opacity-100: 평소엔 숨겨져 있다가(0), 
            마우스를 카드에 올리면(group-hover) 나타납니다(100).
        -->
        <div class="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info class="w-5 h-5 text-indigo-400" />
        </div>

        <!-- 제목 -->
        <h3 class="font-bold text-slate-900 mb-4 text-sm group-hover:text-indigo-600 transition-colors">
            여정 정보
        </h3>

        <!-- 출발지 -> 도착지 시각화 영역 -->
        <div class="space-y-4">
            
            <!-- 1. 출발지 (Start) -->
            <div class="flex items-start gap-3">
                <!-- 초록색 점 (shadow로 번짐 효과) -->
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Start</p>
                    <p class="text-xs font-bold text-slate-700">강남역 2번 출구 앞</p>
                </div>
            </div>

            <!-- 2. 점선 (연결 고리) -->
            <!-- border-l-2 border-dashed: 세로 점선을 그립니다 -->
            <div class="ml-0.5 border-l-2 border-dashed border-slate-100 h-6"></div>

            <!-- 3. 도착지 (Destination) -->
            <div class="flex items-start gap-3">
                <!-- 빨간색 점 -->
                <div class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                </div>
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                    <p class="text-xs font-bold text-slate-700">판교역 지하철 입구</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 
      상세 정보 모달
      - HTML 구조상으로는 여기 있지만, 실제로는 화면 맨 위에 덮어씌워집니다(teleport나 fixed 등을 내부에서 사용).
      - @close: 모달 내부에서 '닫기' 버튼을 누르면 변수를 false로 바꿔서 닫습니다.
    -->
    <RideDetailModal 
        :is-open="isRideDetailModalOpen" 
        @close="isRideDetailModalOpen = false" 
    />
</template>