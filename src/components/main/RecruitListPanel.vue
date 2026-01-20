<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { ref, computed } from 'vue'
import { MapPin, Navigation, ListFilter } from 'lucide-vue-next'
// 새로 만든 컴포넌트 import
import RecruitListItem from './RecruitListItem.vue'

/**
 * ==============================================================================
 * 2. CONFIG & PROPS
 * ==============================================================================
 */
const props = defineProps({
    recruitList: { type: Array, default: () => [] },
    isOpen: Boolean,
    selectedId: Number,
    isSocketConnected: Boolean
})

const emit = defineEmits(['expand', 'select'])

/**
 * ==============================================================================
 * 3. STATE & REFS
 * ==============================================================================
 */
const startInput = ref('')
const destInput = ref('')

/**
 * ==============================================================================
 * 4. COMPUTED
 * ==============================================================================
 */
const filteredList = computed(() => {
    return props.recruitList.filter(item => {
        const s = startInput.value.trim()
        const d = destInput.value.trim()
        return (!s || item.start.includes(s)) && (!d || item.dest.includes(d))
    })
})

/**
 * ==============================================================================
 * 5. METHODS - UI & LOGIC
 * ==============================================================================
 */
// 패널 확장 요청 핸들러
const handleExpand = () => {
    emit('expand')
}

// 리스트 아이템 선택 핸들러
const handleSelectItem = (item) => {
    emit('select', item)
}
</script>

<template>
    <div class="glass-panel w-full md:w-[380px] h-full rounded-[2.5rem] flex flex-col overflow-hidden pointer-events-auto bg-white/90 backdrop-blur-md border border-white/50 shadow-xl transition-transform duration-300"
        :class="{ 'translate-y-0': isOpen, 'translate-y-[calc(100%-150px)] md:translate-y-0': !isOpen }">

        <div class="p-6 md:p-8 border-b border-slate-100 shrink-0">
            <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex justify-between items-center">
                탈래말래
                <span v-if="isSocketConnected"
                    class="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">Online</span>
                <span v-else class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Offline</span>
            </h1>
            <div class="space-y-3">
                <div class="relative group">
                    <MapPin class="absolute left-4 top-3.5 w-4 h-4 text-emerald-500" />
                    <input v-model="startInput" @focus="handleExpand" type="text" placeholder="출발지"
                        class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-indigo-100 outline-none" />
                </div>
                <div class="relative group">
                    <Navigation class="absolute left-4 top-3.5 w-4 h-4 text-rose-500" />
                    <input v-model="destInput" @focus="handleExpand" type="text" placeholder="목적지"
                        class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-indigo-100 outline-none" />
                </div>
                <button
                    class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-2">
                    <ListFilter class="w-4 h-4" />
                    조건에 맞는 모집 찾기
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
            <h3 class="font-bold text-slate-800 text-lg px-1 mb-2">실시간 모집 ({{ filteredList.length }})</h3>

            <div v-if="filteredList.length === 0" class="py-10 text-center text-slate-400 text-sm">
                조건에 맞는 모집 글이 없습니다.
            </div>

            <RecruitListItem v-for="item in filteredList" :key="item.id" :item="item"
                :is-selected="selectedId === item.id" @click="handleSelectItem(item)" />
        </div>
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>