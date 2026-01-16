<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

// 분리한 컴포넌트들 가져오기
import LocationInput from '@/components/main/inputs/LocationInput.vue'
import TimeSelect from '@/components/main/inputs/TimeSelect.vue'
import MemberCounter from '@/components/main/inputs/MemberCounter.vue'
import TagInput from '@/components/main/inputs/TagInput.vue'
import Textarea from '@/components/main/inputs/Textarea.vue'

defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'submit'])

// 폼 데이터
const form = ref({
    start: '',
    dest: '',
    time: 'Now',
    maxMember: 4,
    tags: '',
    desc: ''
})

const handleSubmit = () => {
    const { start, dest, time, maxMember, tags, desc } = form.value

    if (!start || !dest) {
        alert('출발지와 목적지를 입력해주세요.')
        return
    }

    const tagArray = tags ? tags.split(' ').map(t => t.startsWith('#') ? t : `#${t}`) : []

    emit('submit', {
        start, dest, time, max: maxMember, tags: tagArray, desc
    })
}
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm z-[100]">
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="text-xl font-bold text-slate-900">동승 모집하기</h2>
                <button @click="emit('close')"
                    class="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-5">

                <div class="grid grid-cols-2 gap-3">
                    <LocationInput label="출발지" v-model="form.start" placeholder="출발지 입력"
                        label-color="text-emerald-500" />
                    <LocationInput label="목적지" v-model="form.dest" placeholder="목적지 입력" label-color="text-rose-500" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <TimeSelect label="출발 시간" v-model="form.time" />
                    <MemberCounter label="모집 인원" v-model="form.maxMember" :min="2" :max="10" />
                </div>

                <TagInput label="태그 (선택)" v-model="form.tags" placeholder="예: #비흡연 #여성전용" />

                <Textarea label="하고 싶은 말" v-model="form.desc" placeholder="예: 짐이 조금 있어요" />
            </div>

            <div class="p-6 border-t border-slate-100 bg-white">
                <button @click="handleSubmit"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    모집 시작하기
                </button>
            </div>

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