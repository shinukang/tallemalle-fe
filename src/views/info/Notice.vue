<script setup>
import { ref, onMounted } from 'vue';
import { ChevronDown, List } from 'lucide-vue-next'; // 아이콘 직접 임포트
import api from '@/api/notice/index.js';

// 상태 관리
const activeTab = ref('notice');
const activeFaq = ref(null);
const noticeList = ref([]);

// 공지사항 리스트 가져오기
const getNoticeList = async () => {
    try {
        const res = await api.noticeList();
        // API 데이터가 기대한 구조인지 확인 후 할당
        noticeList.value = res.data || [];
    } catch (error) {
        console.error("공지사항을 불러오는 중 오류 발생:", error);
    }
}

const faqs = ref([
    { question: '매칭이 완료된 후 취소하면 어떻게 되나요?', answer: '배차가 완료된 후 취소할 경우 다른 동승자들에게 피해가 갈 수 있습니다. 잦은 취소 시 매너 온도가 하락하거나 이용이 제한될 수 있습니다.' },
    { question: '결제는 어떤 방식으로 진행되나요?', answer: '목적지 도착 후 정산하기 버튼을 누르면 사전에 등록하신 카드로 자동 결제됩니다.' }
]);

const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index;
};

onMounted(() => {
    getNoticeList();
});
</script>

<template>
    <div class="flex h-screen p-4 gap-4 bg-[#f8fafc] font-['Pretendard'] overflow-hidden">
        <div id="navbar-container" class="w-20 h-full shrink-0 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm"></div>

        <div class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col">
            <div class="border-b border-slate-100 bg-white/50 w-full">
                <div class="max-w-5xl mx-auto px-8 py-8">
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">공지사항</h1>
                    <p class="text-sm text-slate-400 font-medium mt-1">탈래말래의 새로운 소식과 자주 묻는 질문을 확인하세요.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-5xl mx-auto space-y-6">
                    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        
                        <div class="flex border-b border-slate-50">
                            <button @click="activeTab = 'notice'" 
                                :class="['flex-1 py-6 text-sm font-bold border-b-2 transition-all', 
                                activeTab === 'notice' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600 bg-white']">
                                공지사항
                            </button>
                            <button @click="activeTab = 'faq'" 
                                :class="['flex-1 py-6 text-sm font-bold border-b-2 transition-all', 
                                activeTab === 'faq' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600 bg-white']">
                                자주 묻는 질문 (FAQ)
                            </button>
                        </div>

                        <div v-if="activeTab === 'notice'" class="tab-content flex-1 overflow-y-auto custom-scroll p-8 space-y-4">
                            <div v-if="noticeList.length === 0" class="py-20 text-center text-slate-400">
                                등록된 공지사항이 없습니다.
                            </div>
                            <RouterLink v-for="(item, index) in noticeList" :key="item.id || index" :to="`/notice/detail/${item.id}`"
                                custom v-slot="{ navigate }">
                                <div @click="navigate"
                                    class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
                                    <div class="flex justify-between items-center mb-4">
                                        <div class="flex gap-2">
                                            <span :class="[item.tagClass || 'bg-indigo-100 text-indigo-600', 'text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider']">
                                                {{ item.tag || '공지' }}
                                            </span>
                                            <span v-if="item.isEssential" class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                                필독
                                            </span>
                                        </div>
                                        <span class="text-[11px] font-medium text-slate-400">{{ item.date }}</span>
                                    </div>
                                    <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {{ item.title }}
                                    </h3>
                                    <p class="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                                        {{ item.description }}
                                    </p>
                                </div>
                            </RouterLink>
                        </div>

                        <div v-if="activeTab === 'faq'" class="tab-content flex-1 overflow-y-auto custom-scroll p-8 space-y-3">
                            <div v-for="(item, index) in faqs" :key="index"
                                class="faq-item bg-white p-6 rounded-[2rem] border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all"
                                :class="{ 'active': activeFaq === index }" @click="toggleFaq(index)">
                                <div class="flex justify-between items-center gap-4">
                                    <div class="flex gap-4 items-center flex-1">
                                        <span class="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">Q</span>
                                        <p class="text-[15px] font-bold text-slate-800 leading-snug">{{ item.question }}</p>
                                    </div>
                                    <div class="p-2 bg-slate-50 rounded-full shrink-0">
                                        <ChevronDown :class="['w-4 h-4 text-slate-400 transition-transform duration-300', { 'rotate-180 text-indigo-600': activeFaq === index }]" />
                                    </div>
                                </div>
                                <div class="faq-answer-container" :class="{ 'is-open': activeFaq === index }">
                                    <div class="faq-answer-content flex gap-4 pl-14 pt-2">
                                        <div class="text-[14px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl w-full">
                                            {{ item.answer }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800&display=swap");

.glass-panel {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(30, 27, 75, 0.05);
}

.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

/* 탭 전환 애니메이션 */
.tab-content {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* FAQ 아코디언 애니메이션 최적화 */
.faq-answer-container {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-out, opacity 0.2s;
    opacity: 0;
    overflow: hidden;
}

.faq-answer-container.is-open {
    grid-template-rows: 1fr;
    opacity: 1;
    margin-top: 1rem;
}

.faq-answer-content {
    min-height: 0;
}
</style>