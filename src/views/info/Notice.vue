<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/notice/index.js'
import PageHeader from '@/components/layout/PageHeader.vue'
import NoticeTabButton from '@/components/notice/NoticeTabButton.vue'
import NoticeCard from '@/components/notice/NoticeCard.vue'
import FaqItem from '@/components/notice/FaqItem.vue'

// 상태 관리
const activeTab = ref('notice')
const activeFaq = ref(null)
const noticeList = ref([])
const faqs = ref([])

// 공지사항 리스트 가져오기
const getNoticeList = async () => {
  try {
    const res = await api.noticeList()
    // API 데이터가 기대한 구조인지 확인 후 할당
    noticeList.value = res.data || []
  } catch (error) {
    console.error('공지사항을 불러오는 중 오류 발생:', error)
  }
}

// FAQ 리스트 가져오기
const getFaqList = async () => {
  try {
    const res = await api.faqList() // API 호출
    // console.log("받아온 FAQ 데이터:", res) 

    faqs.value = res.data || res 
  } catch (error) {
    console.error('FAQ를 불러오는 중 오류 발생:', error)
  }
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

onMounted(() => {
  getNoticeList()
  getFaqList()
})
</script>

<template>
  <div class="flex h-screen p-4 gap-4 bg-[#f8fafc] font-['Pretendard'] overflow-hidden">
    <div
      id="navbar-container"
      class="w-20 h-full shrink-0 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm"
    ></div>

    <div class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col">
      <PageHeader
        title="공지사항"
        description="탈래말래의 새로운 소식과 자주 묻는 질문을 확인하세요."
      />

      <div class="flex-1 overflow-y-auto custom-scroll p-8">
        <div class="max-w-5xl mx-auto space-y-6">
          <div
            class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]"
          >
            <!-- 공지사항 탭 버튼 -->
            <div class="flex border-b border-slate-50">
              <NoticeTabButton :active="activeTab === 'notice'" @click="activeTab = 'notice'"
                >공지사항</NoticeTabButton
              >
              <NoticeTabButton :active="activeTab === 'faq'" @click="activeTab = 'faq'"
                >자주 묻는 질문 (FAQ)</NoticeTabButton
              >
            </div>

            <!-- 공지사항 카드 컴포넌트 (NoticeCard) -->
            <div
              v-if="activeTab === 'notice'"
              class="tab-content flex-1 overflow-y-auto custom-scroll p-8 space-y-4"
            >
              <div v-if="noticeList.length === 0" class="py-20 text-center text-slate-400">
                등록된 공지사항이 없습니다.
              </div>
              <NoticeCard v-for="item in noticeList" :key="item.id" :item="item" />
            </div>

            <!-- FAQ 아코디언 컴포넌트 -->
            <div
              v-if="activeTab === 'faq'"
              class="tab-content flex-1 overflow-y-auto custom-scroll p-8 space-y-3"
            >
              <FaqItem
                v-for="(item, index) in faqs"
                :key="index"
                :question="item.question"
                :answer="item.answer"
                :is-open="activeFaq === index"
                @toggle="toggleFaq(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;800&display=swap');

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
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
