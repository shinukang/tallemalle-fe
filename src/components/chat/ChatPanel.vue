<script setup>
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import ChatComposer from './ChatComposer.vue'

const props = defineProps({
    messages: {
        type: Array,
        default: () => []
    },
    isConnected: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['send-message', 'open-profile'])

const forwardSendMessage = (text) => {
    emit('send-message', text)
}

const forwardOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <div
        class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
        
        <!-- 상단 헤더 (연결 상태 전달) -->
        <ChatHeader :is-connected="isConnected" />

        <!-- 메시지 리스트 -->
        <MessageList 
            :messages="messages" 
            @open-profile="forwardOpenProfile" 
        />

        <!-- 입력창 -->
        <ChatComposer @send-message="forwardSendMessage" />
        
    </div>
</template>