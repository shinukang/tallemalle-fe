<script setup>
/**
 * [파일 설명]
 * 이 파일은 주고받은 메시지들을 화면에 리스트 형태로 뿌려주는 컴포넌트입니다.
 * * * 주요 역할:
 * 1. messages 배열을 받아서 반복문(v-for)을 돌며 메시지 하나하나(MessageItem)를 그립니다.
 * 2. 새로운 메시지가 도착하면 자동으로 스크롤을 맨 아래로 내려줍니다.
 * 3. 스크롤 가능한 영역(Container)을 관리합니다.
 */

import { ref, nextTick, watch } from 'vue'
import MessageItem from './MessageItem.vue' // 메시지 한 줄을 담당하는 컴포넌트

/**
 * Props 정의
 * - messages: ChatPanel(부모) -> ChatView(할아버지)에서 관리하는 전체 대화 기록입니다.
 * 배열 안에 객체 형태({ id, text, type... })로 들어있습니다.
 */
const props = defineProps({
    messages: {
        type: Array,
        default: () => []
    }
})

/**
 * Emits 정의
 * - open-profile: 메시지 아이템 내부의 프로필 사진을 클릭했을 때 발생하는 이벤트입니다.
 * 여기서 처리하지 않고, 상위 컴포넌트로 계속 전달(Bubble up)합니다.
 */
const emit = defineEmits(['open-profile'])

/**
 * Template Ref (DOM 요소 직접 접근)
 * - HTML <template>에 있는 <div ref="chatContainer">와 연결됩니다.
 * - 스크롤 위치를 조작하기 위해 사용합니다.
 */
const chatContainer = ref(null)

/**
 * [핵심 기능] 스크롤을 맨 아래로 내리기
 * - 메시지가 추가되면 화면 밖으로 넘어가기 때문에, 항상 최신 메시지가 보이도록
 * 스크롤 바를 강제로 바닥으로 내리는 함수입니다.
 */
const scrollToBottom = async () => {
    // await nextTick(): Vue가 데이터 변경을 감지하고 실제 화면(DOM)을 다 그릴 때까지 기다립니다.
    // 화면이 다 그려지기 전에 스크롤을 내리면, 새 메시지 높이가 반영 안 돼서 덜 내려갈 수 있거든요.
    await nextTick()
    
    if (chatContainer.value) {
        // scrollTop(현재 스크롤 위치) = scrollHeight(전체 스크롤 내용의 길이)
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

/**
 * Watcher (감시자)
 * - props.messages 값이 바뀔 때마다(즉, 새 메시지가 오면) 감지합니다.
 * - 감지될 때마다 scrollToBottom() 함수를 실행합니다.
 * - { deep: true }: 배열 내부의 내용 변경까지 깊게 감시합니다.
 */
watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })

/**
 * [이벤트 전달] 프로필 열기
 * - MessageItem(자식) -> MessageList(나) -> ChatPanel(부모) 순서로 전달합니다.
 */
const requestOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <!-- 
      스크롤 컨테이너 영역
      - ref="chatContainer": 스크립트에서 이 div를 제어하기 위한 이름표
      - flex-1: 남은 공간 꽉 채우기
      - overflow-y-auto: 내용이 넘치면 세로 스크롤바 생김
      - pb-24 md:pb-6: 모바일에서는 하단 입력창에 가려지지 않게 패딩을 많이(24) 줌
    -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll pb-24 md:pb-6">
        
        <!-- 메시지 반복 렌더링 -->
        <!-- 
           v-for="msg in messages": 메시지 개수만큼 반복
           :key="msg.id": Vue가 각 항목을 구분하는 고유표식 (성능 최적화 필수)
           :msg="msg": 데이터 객체 통째로 전달
        -->
        <MessageItem 
            v-for="msg in messages" 
            :key="msg.id" 
            :msg="msg" 
            @open-profile="requestOpenProfile" 
        />
        
    </div>
</template>

<style scoped>
/* 커스텀 스크롤바 스타일링 (Webkit 브라우저용) */
.custom-scroll::-webkit-scrollbar {
    width: 4px; /* 스크롤바 너비를 얇게 */
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0; /* 스크롤바 막대 색상 (연한 회색) */
    border-radius: 10px;  /* 둥글게 처리 */
}
</style>