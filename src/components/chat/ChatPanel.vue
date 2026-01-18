<script setup>
/**
 * [파일 설명]
 * 이 파일은 채팅 화면의 '가운데 패널' 전체를 담당하는 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 채팅방의 레이아웃(헤더, 메시지 목록, 입력창)을 잡습니다.
 * 2. 부모(ChatView)로부터 받은 데이터를 하위 컴포넌트들에게 전달합니다. (Props 전달)
 * 3. 하위 컴포넌트에서 발생한 이벤트(메시지 전송 등)를 부모에게 다시 올려보냅니다. (Event Emitting)
 * * * 구조:
 * [ ChatHeader  ] <- 상단: 제목, 연결 상태
 * [ MessageList ] <- 중간: 주고받은 대화 내용
 * [ ChatComposer] <- 하단: 메시지 입력 및 전송 버튼
 */

import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import ChatComposer from './ChatComposer.vue'

/**
 * Props 정의 (부모로부터 받는 데이터)
 * - messages: 채팅 메시지들이 담긴 배열. (MessageList에게 넘겨줄 예정)
 * - isConnected: 현재 웹소켓 연결 상태. (ChatHeader에게 넘겨줘서 초록불/빨간불 표시 예정)
 */
const props = defineProps({
    messages: {
        type: Array,
        default: () => [] // 데이터가 안 넘어오면 빈 배열로 초기화
    },
    isConnected: {
        type: Boolean,
        default: false    // 기본값은 '연결 안 됨'
    },
    rideInfo: { type: Object, default: null }
})

/**
 * Emits 정의 (부모에게 보낼 신호)
 * - send-message: 사용자가 메시지를 입력하고 전송 버튼을 눌렀을 때
 * - open-profile: 사용자가 채팅창 내의 프로필 사진을 클릭했을 때
 */
const emit = defineEmits(['send-message', 'open-profile'])

/**
 * [이벤트 전달 함수 1] 메시지 전송
 * - 자식(ChatComposer)이 "메시지 보낼래!"라고 하면 실행됩니다.
 * - 이 컴포넌트는 직접 처리하지 않고, 부모(ChatView)에게 "얘가 이거 보낸대요~"라고 토스합니다.
 */
const forwardSendMessage = (text) => {
    emit('send-message', text)
}

/**
 * [이벤트 전달 함수 2] 프로필 열기
 * - 자식(MessageList -> MessageItem)에서 프로필 클릭이 발생하면 실행됩니다.
 * - 마찬가지로 부모(ChatView)에게 "이 유저 ID의 프로필을 보여주세요"라고 토스합니다.
 */
const forwardOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <!-- 
      메인 컨테이너 스타일링
      - flex-1: 남은 공간을 꽉 채움
      - flex-col: 내부 요소들을 세로로 배치 (헤더 -> 리스트 -> 입력창)
      - glass-panel: 유리 같은 반투명 효과 (CSS 클래스)
      - relative: 내부 자식들의 위치 기준점
    -->
    <div
        class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
        
        <!-- 1. 상단 헤더 -->
        <!-- 부모에게서 받은 isConnected 정보를 헤더에게 그대로 전달합니다. -->
        <ChatHeader :is-connected="isConnected" :ride-info="rideInfo" />

        <!-- 2. 메시지 리스트 (스크롤 영역) -->
        <!-- 
           :messages="messages" -> 대화 내용을 전달
           @open-profile="..."  -> 메시지 옆 얼굴 클릭 시 발생할 이벤트 연결
        -->
        <MessageList 
            :messages="messages" 
            @open-profile="forwardOpenProfile" 
        />

        <!-- 3. 하단 입력창 -->
        <!-- @send-message="..." -> 전송 버튼 클릭 시 발생할 이벤트 연결 -->
        <ChatComposer @send-message="forwardSendMessage" />
        
    </div>
</template>