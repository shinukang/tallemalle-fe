<script setup>
defineProps({
    msg: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['open-profile'])

const onProfileClick = (userId) => {
    emit('open-profile', userId)
}
</script>

<template>
    <!-- 날짜 구분선 -->
    <div v-if="msg.type === 'date'" class="flex justify-center">
        <span class="text-[10px] font-bold text-slate-300 bg-slate-100 px-3 py-1 rounded-full uppercase">
            {{ msg.text }}
        </span>
    </div>

    <!-- 시스템 메시지 -->
    <div v-else-if="msg.type === 'system'" class="flex justify-center">
        <div class="bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/50">
            <p class="text-[11px] text-indigo-400 font-medium">{{ msg.text }}</p>
        </div>
    </div>

    <!-- 상대방 메시지 -->
    <div v-else-if="msg.type === 'other'" class="flex items-end gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
            @click="onProfileClick(msg.sender)">
            <img :src="msg.avatar" alt="user" />
        </div>
        <div class="flex flex-col gap-1 max-w-[70%]">
            <span class="text-[10px] text-slate-400 ml-1">{{ msg.sender }}</span>
            <div
                class="bg-white border border-slate-100 p-3.5 text-sm leading-relaxed shadow-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-slate-800">
                {{ msg.text }}
            </div>
        </div>
        <span class="text-[10px] text-slate-300 mb-1">{{ msg.time }}</span>
    </div>

    <!-- 내 메시지 -->
    <div v-else-if="msg.type === 'me'" class="flex items-end gap-3 justify-end">
        <span class="text-[10px] text-slate-300 mb-1">{{ msg.time }}</span>
        <div class="flex flex-col gap-1 max-w-[70%] items-end">
            <div
                class="bg-indigo-600 text-white p-3.5 text-sm leading-relaxed shadow-lg shadow-indigo-100 rounded-tl-2xl rounded-tr-xl rounded-bl-2xl">
                {{ msg.text }}
            </div>
        </div>
    </div>
</template>