<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-vue-next'

const router = useRouter()
const activeTab = ref('notice') // 'notice' | 'faq'

// 공지사항 데이터
const notices = [
    { id: 1, type: '공지', isMustRead: true, date: '2024.03.15', title: '매너 온도 산정 방식 고도화 안내', content: '보다 쾌적한 동승 환경을 위해 매너 점수 알고리즘이 업데이트 되었습니다.' },
    { id: 2, type: '이벤트', isMustRead: false, date: '2024.03.10', title: '봄맞이 웰컴 쿠폰팩 증정 이벤트', content: '새학기 시작을 응원하며 모든 유저분들께 3,000원 할인권을 드립니다.' },
    { id: 3, type: '안내', isMustRead: false, date: '2024.03.01', title: '서비스 이용약관 개정 안내', content: '사용자 데이터 보호 강화를 위해 개인정보 정책이 일부 개정되었습니다.' }
]

// FAQ 데이터
const faqs = ref([
    { id: 1, q: '매칭이 완료된 후 취소하면 어떻게 되나요?', a: '배차가 완료된 후 취소할 경우 매너 온도가 하락하거나 이용이 제한될 수 있습니다.', isOpen: false },
    { id: 2, q: '결제는 어떤 방식으로 진행되나요?', a: '목적지 도착 후 등록된 카드로 자동 결제되며, 인원수대로 1/N 정산됩니다.', isOpen: false }
])

const toggleFaq = (id) => {
    const item = faqs.value.find(f => f.id === id)
    if (item) item.isOpen = !item.isOpen
}
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
            <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">공지사항</h1>
                    <p class="text-sm text-slate-400 font-medium mt-1">탈래말래의 새로운 소식과 자주 묻는 질문을 확인하세요.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-5xl mx-auto space-y-6">

                    <div
                        class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        <div class="flex border-b border-slate-50">
                            <button @click="activeTab = 'notice'"
                                class="flex-1 py-6 text-sm font-bold border-b-2 transition-all"
                                :class="activeTab === 'notice' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'">
                                공지사항
                            </button>
                            <button @click="activeTab = 'faq'"
                                class="flex-1 py-6 text-sm font-bold border-b-2 transition-all"
                                :class="activeTab === 'faq' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'">
                                자주 묻는 질문 (FAQ)
                            </button>
                        </div>

                        <div v-if="activeTab === 'notice'" class="flex-1 p-8 space-y-4">
                            <div v-for="notice in notices" :key="notice.id"
                                class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
                                <div class="flex justify-between items-center mb-4">
                                    <div class="flex gap-2">
                                        <span
                                            class="text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider"
                                            :class="notice.type === '이벤트' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'">
                                            {{ notice.type }}
                                        </span>
                                        <span v-if="notice.isMustRead"
                                            class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">필독</span>
                                    </div>
                                    <span class="text-[11px] font-medium text-slate-400">{{ notice.date }}</span>
                                </div>
                                <h3
                                    class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {{ notice.title }}</h3>
                                <p class="text-sm text-slate-500 mt-2 leading-relaxed">{{ notice.content }}</p>
                            </div>
                        </div>

                        <div v-if="activeTab === 'faq'" class="flex-1 p-8 space-y-3">
                            <div v-for="faq in faqs" :key="faq.id"
                                class="bg-white p-6 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all"
                                :class="{ 'bg-slate-50': faq.isOpen }" @click="toggleFaq(faq.id)">

                                <div class="flex justify-between items-center gap-4">
                                    <div class="flex gap-4 items-center flex-1">
                                        <span
                                            class="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">Q</span>
                                        <p class="text-[15px] font-bold text-slate-800">{{ faq.q }}</p>
                                    </div>
                                    <component :is="faq.isOpen ? ChevronUp : ChevronDown"
                                        class="w-4 h-4 text-slate-400" />
                                </div>

                                <div v-show="faq.isOpen"
                                    class="mt-4 pl-14 text-sm text-slate-600 leading-relaxed bg-white/50 p-4 rounded-2xl">
                                    {{ faq.a }}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>