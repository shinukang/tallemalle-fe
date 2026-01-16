<script setup>
import { ref, nextTick, watch } from 'vue'
import MessageItem from './MessageItem.vue'

const props = defineProps({
    messages: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['open-profile'])

const chatContainer = ref(null)

// 메시지가 추가되면 스크롤을 맨 아래로 이동
const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

// messages prop이 변경될 때마다 감지
watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })

const requestOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
        <MessageItem 
            v-for="msg in messages" 
            :key="msg.id" 
            :msg="msg" 
            @open-profile="requestOpenProfile" 
        />
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>