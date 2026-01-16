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

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })

const requestOpenProfile = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll pb-24 md:pb-6">
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