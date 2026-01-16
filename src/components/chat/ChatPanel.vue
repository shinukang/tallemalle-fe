<script setup>
import { ref } from 'vue'
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import ChatComposer from './ChatComposer.vue'

const emit = defineEmits(['open-profile'])

// --- 상태 데이터 (채팅 메시지 원본 데이터) ---
const messages = ref([
    { id: 1, type: 'date', text: 'Today' },
    {
        id: 2, type: 'other', text: '안녕하세요! 지금 2번 출구 앞에 노란색 카카오 택시 옆에 서있어요.',
        sender: 'Aiden', time: '18:21', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden'
    },
    {
        id: 3, type: 'me', text: '네, 확인했습니다! 저 지금 에스컬레이터 타고 올라가고 있어요. 1분만 기다려주세요!',
        time: '18:22'
    },
    { id: 4, type: 'system', text: "✨ '지수'님이 그룹에 참여했습니다." },
    {
        id: 5, type: 'other', text: '안녕하세요~ 저도 지금 거의 다 왔어요!',
        sender: 'Ji-su', time: '18:24', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su'
    }
])

// ChatComposer에서 텍스트를 받아 메시지 추가
const addMessage = (text) => {
    const now = new Date()
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    messages.value.push({
        id: Date.now(),
        type: 'me',
        text: text,
        time: timeStr
    })
}

// MessageList에서 올라온 이벤트를 다시 상위(Chat.vue)로 전달
const forwardOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <div
        class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
        
        <!-- 상단 헤더 -->
        <ChatHeader />

        <!-- 메시지 리스트 (데이터 주입) -->
        <MessageList 
            :messages="messages" 
            @open-profile="forwardOpenProfile" 
        />

        <!-- 입력창 (이벤트 수신) -->
        <ChatComposer @send-message="addMessage" />
        
    </div>
</template>