<script setup>
/**
 * [파일 설명]
 * 이 파일은 멤버 리스트의 '한 줄(Row)'을 담당하는 작은 부품 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 부모에게서 받은 이름, 사진, 설명글을 예쁘게 보여줍니다.
 * 2. '나'인 경우: 클릭해도 아무 일도 안 일어나고, 파란 테두리로 강조됩니다.
 * 3. '남'인 경우: 마우스를 올리면 배경이 변하고, 클릭하면 프로필이 열립니다.
 */

/**
 * Props 정의
 * - img: 프로필 이미지 URL
 * - name: 사용자 이름
 * - subText: 이름 아래에 들어갈 작은 글씨 (예: '매너점수 42점' 또는 '프로필 보기')
 * - isMe: 이 사람이 '나'인지 확인하는 스위치 (true면 나, false면 남)
 */
defineProps({
    img: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subText: {
        type: String,
        required: true
    },
    isMe: {
        type: Boolean,
        default: false // 기본값은 '남'으로 설정
    }
})

/**
 * Emits 정의
 * - item-click: 이 줄을 클릭했을 때 부모에게 알리는 신호입니다.
 */
const emit = defineEmits(['item-click'])

/**
 * [기능 함수] 클릭 처리
 * - 템플릿에서 바로 emit을 써도 되지만, 로직을 분리해두면 나중에 확장이 쉽습니다.
 */
const handleClick = () => {
    emit('item-click')
}
</script>

<template>
    <!-- 
      리스트 아이템 컨테이너
      - flex items-center: 사진과 글자를 가로로 나란히 배치
      - :class="..." -> 조건부 스타일링 (핵심!)
        -> isMe가 true면: 아무 효과 없음
        -> isMe가 false면(남이면): 커서가 손가락 모양으로 변하고(cursor-pointer), 배경색이 변함(hover:bg-slate-50)
      - @click: '나'가 아닐 때(!isMe)만 클릭 함수가 실행됨
    -->
    <div class="flex items-center gap-3 p-2 rounded-xl -mx-2 transition-colors"
        :class="isMe ? '' : 'cursor-pointer hover:bg-slate-50'"
        @click="!isMe && handleClick()">
        
        <!-- 1. 프로필 이미지 -->
        <!-- :class -> 내가 맞으면 파란색 테두리(border-indigo-600)를 두릅니다. -->
        <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-sm"
             :class="isMe ? 'border-2 border-indigo-600' : ''">
            <img :src="img" alt="user" class="w-full h-full object-cover" />
        </div>

        <!-- 2. 텍스트 정보 영역 -->
        <div>
            <p class="text-sm font-bold text-slate-900 flex items-center gap-1">
                {{ name }}
                
                <!-- '나' 뱃지 -->
                <!-- v-if="isMe": '나'일 때만 이 <span> 태그가 화면에 그려집니다. -->
                <span v-if="isMe" class="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md">나</span>
            </p>
            
            <!-- 서브 텍스트 (상태 메시지 등) -->
            <!-- 
               :class -> 
               '나'면: 연한 회색(text-slate-400)으로 얌전하게
               '남'이면: 보라색(text-indigo-500)으로 '눌러보세요' 느낌을 줌
            -->
            <p class="text-xs" :class="isMe ? 'text-slate-400' : 'text-indigo-500 font-medium italic'">
                {{ subText }}
            </p>
        </div>
    </div>
</template>