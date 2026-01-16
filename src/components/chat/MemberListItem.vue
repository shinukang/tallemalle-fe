<script setup>
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
        default: false
    }
})

const emit = defineEmits(['item-click'])

const handleClick = () => {
    emit('item-click')
}
</script>

<template>
    <div class="flex items-center gap-3 p-2 rounded-xl -mx-2 transition-colors"
        :class="isMe ? '' : 'cursor-pointer hover:bg-slate-50'"
        @click="!isMe && handleClick()">
        
        <!-- 프로필 이미지 -->
        <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-sm"
             :class="isMe ? 'border-2 border-indigo-600' : ''">
            <img :src="img" alt="user" />
        </div>

        <!-- 텍스트 정보 -->
        <div>
            <p class="text-sm font-bold text-slate-900 flex items-center gap-1">
                {{ name }}
                <!-- '나' 뱃지 -->
                <span v-if="isMe" class="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md">나</span>
            </p>
            <!-- 서브 텍스트 (상태 또는 버튼 텍스트) -->
            <p class="text-xs" :class="isMe ? 'text-slate-400' : 'text-indigo-500 font-medium italic'">
                {{ subText }}
            </p>
        </div>
    </div>
</template>