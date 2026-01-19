<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import {
  Camera,
  UserMinus,
  CreditCard,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Quote,
  Star,
  X,
  MessageSquareText,
} from 'lucide-vue-next'
import api from '@/api/profile'
import RoundBox from '@/components/layout/RoundBox.vue' // RoundBox 컴포넌트 임포트
import EditPayment from '@/views/payment/EditPayment.vue'
import HistoryEntry from '@/components/entry/HistoryEntry.vue'
import ReviewEntry from '@/components/entry/ReviewEntry.vue'

// --- 상태 ---
const activeTab = ref('history') // 'history' | 'reviews'
const isRideHistoryModalOpen = ref(false)
const isEditPaymentModalOpen = ref(false)
const isReviewModalOpen = ref(false)
const currentHistory = ref({})
const currentReview = ref({})
const profileImage = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')

const profile = ref({
  name: '',
  nickname: '',
  phone: '',
  bio: '',
  styles: ['style-1', 'style-3', 'style-5'],
})

const history = reactive({
  list: [],
})
const review = reactive({
  list: [],
})

// --- 스크롤 상태 감지 로직 ---
const historyScrollRef = ref(null)
const reviewScrollRef = ref(null)
const scrollState = reactive({
  history: { top: false, bottom: false },
  reviews: { top: false, bottom: false },
})

const checkScroll = (el, type) => {
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  const canScroll = scrollHeight > clientHeight

  if (canScroll) {
    scrollState[type].top = scrollTop > 10
    scrollState[type].bottom = scrollTop + clientHeight < scrollHeight - 10
  } else {
    scrollState[type].top = false
    scrollState[type].bottom = false
  }
}

// 데이터 변화나 탭 전환 시 상태 업데이트
watch(
  [activeTab, () => history.list, () => review.list],
  async () => {
    await nextTick()
    if (activeTab.value === 'history') checkScroll(historyScrollRef.value, 'history')
    else checkScroll(reviewScrollRef.value, 'reviews')
  },
  { deep: true },
)

// --- 메소드 ---
const switchTab = (tab) => {
  activeTab.value = tab
}

const openRideDetail = (id) => {
  const selected = history.list.find((item) => item.id === id)
  if (selected) {
    currentHistory.value = selected
    isRideHistoryModalOpen.value = true
  }
}

const openMyReview = (item) => {
  currentReview.value = item
  isReviewModalOpen.value = true
}

const handleEditPaymentModal = () => {
  isEditPaymentModalOpen.value = !isEditPaymentModalOpen.value
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (profileImage.value = e.target.result)
    reader.readAsDataURL(file)
  }
}

const getHistory = async () => {
  try {
    const res = await api.history()
    if (res.data) {
      history.list = res.data
      await nextTick()
      checkScroll(historyScrollRef.value, 'history')
    }
  } catch (error) {
    console.error('HISTORY: ', error)
  }
}

const getReview = async () => {
  try {
    const res = await api.review()
    if (res.data) {
      review.list = res.data
      await nextTick()
      checkScroll(reviewScrollRef.value, 'reviews')
    }
  } catch (error) {
    console.error('REVIEW: ', error)
  }
}

const getProfile = async () => {
  try {
    const res = await api.profile()
    if (res.data) {
      Object.assign(profile.value, res.data)
      console.log(profile)
    }
  } catch (error) {
    console.error('PROFILE: ', error)
  }
}

onMounted(async () => {
  getProfile()
  getHistory()
  getReview()
})
</script>

<template>
  <div class="h-full flex gap-4 p-4 overflow-hidden relative text-slate-900">
    <div class="hidden md:block w-20 shrink-0"></div>

    <div
      class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-xl"
    >
      <!-- 헤더 -->
      <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight text-left">
            마이페이지
          </h1>
          <p class="text-sm text-slate-400 font-medium mt-1 text-left">
            나의 동승 기록과 프로필 정보를 관리하세요.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">누적 동승</p>
            <p class="text-lg font-black text-indigo-600">{{ history.list.length }}회</p>
          </div>
          <div class="w-px h-8 bg-slate-200 self-center"></div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">절약 금액</p>
            <p class="text-lg font-black text-emerald-600">24.5만</p>
          </div>
        </div>
      </div>

      <!-- 메인 컨테이너 -->
      <div class="flex-1 overflow-hidden p-8 flex flex-col">
        <div class="max-w-6xl mx-auto grid grid-cols-12 gap-8 w-full flex-1 min-h-0">
          <!-- 프로필 카드 -->
          <div class="col-span-12 lg:col-span-4 space-y-6 flex flex-col min-h-0">
            <!-- 사용자 RoundBox 컴포넌트 적용 (p-8 -> padding="32px") -->
            <RoundBox padding="32px" class="text-center relative overflow-hidden flex-none">
              <div class="absolute top-0 left-0 w-full h-24 bg-slate-50"></div>
              <div class="relative w-28 h-28 mx-auto mb-4 mt-4">
                <img
                  :src="profileImage"
                  class="w-full h-full rounded-full bg-white border-4 border-white shadow-xl object-cover"
                />
                <label
                  class="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Camera class="w-4 h-4" />
                  <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
                </label>
              </div>
              <h2 class="text-xl font-bold text-slate-900">판교동승왕님</h2>
              <p class="text-xs text-slate-400 mb-6 text-center">pangyo_king@gmail.com</p>
              <RouterLink to="/editprofile">
                <button
                  class="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                >
                  개인정보 수정
                </button>
              </RouterLink>
            </RoundBox>

            <!-- 매너 등급 (p-7 -> padding="28px") -->
            <RoundBox padding="28px" class="flex-none">
              <div class="flex justify-between items-start mb-4">
                <div class="text-left">
                  <span
                    class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1"
                    >나의 매너 등급</span
                  >
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-indigo-600 tracking-tighter">85</span>
                    <span class="text-sm font-bold text-slate-300">/ 100</span>
                  </div>
                </div>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  style="width: 85%"
                ></div>
              </div>
              <p class="text-[11px] text-slate-400 mt-4 leading-relaxed text-center font-medium">
                평점 4.8/5.0 <span class="text-indigo-600">상위 5%</span>의 매너를 가진
                이용자입니다!
              </p>
            </RoundBox>

            <div class="flex-1"></div>
            <div class="pt-4 flex justify-center mt-auto flex-none">
              <button
                class="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-all font-bold text-[11px]"
              >
                <UserMinus class="w-3.5 h-3.5" />
                탈래말래 탈퇴하기
              </button>
            </div>
          </div>

          <!-- 탑승 기록 / 리뷰 탭 섹션 -->
          <div class="col-span-12 lg:col-span-8 space-y-6 flex flex-col min-h-0">
            <!-- 결제 수단 (p-8 -> padding="32px") -->
            <RoundBox padding="32px" class="flex-none">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-slate-900 flex items-center gap-2 text-left">
                  <CreditCard class="w-5 h-5 text-indigo-600" /> 나의 결제 수단
                </h3>
                <button
                  @click="handleEditPaymentModal"
                  class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  카드 추가
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="flex items-center justify-between p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-10 h-7 bg-white/10 rounded flex items-center justify-center text-[8px] font-black italic"
                    >
                      VISA
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-bold">신한카드 (4215)</p>
                      <p class="text-[10px] text-slate-400">기본 결제 수단</p>
                    </div>
                  </div>
                  <CheckCircle2 class="w-5 h-5 text-indigo-400 flex-none" />
                </div>
              </div>
            </RoundBox>

            <!-- 기록/리뷰 탭 (내부 레이아웃을 위해 padding="0" 적용) -->
            <RoundBox padding="0" class="overflow-hidden flex flex-col flex-none h-[450px]">
              <div class="flex border-b border-slate-50 flex-none">
                <button
                  @click="switchTab('history')"
                  class="flex-1 py-6 text-sm font-bold border-b-2 transition-all"
                  :class="
                    activeTab === 'history'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  "
                >
                  최근 탑승 기록
                </button>
                <button
                  @click="switchTab('reviews')"
                  class="flex-1 py-6 text-sm font-bold border-b-2 transition-all"
                  :class="
                    activeTab === 'reviews'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  "
                >
                  받은 리뷰
                  <span class="ml-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">{{
                    review.list.length
                  }}</span>
                </button>
              </div>

              <!-- 리스트 영역 -->
              <div class="relative flex-1 min-h-0">
                <!-- 탑승 기록 리스트 -->
                <div
                  v-if="activeTab === 'history'"
                  class="h-full relative content-fade-wrapper"
                  :class="{
                    'show-top': scrollState.history.top,
                    'show-bottom': scrollState.history.bottom,
                  }"
                >
                  <div
                    ref="historyScrollRef"
                    @scroll="checkScroll($event.target, 'history')"
                    class="h-full overflow-y-auto custom-scroll p-6 pb-20 flex flex-col gap-2.5"
                  >
                    <HistoryEntry
                      v-for="item in history.list"
                      :key="item.id"
                      :start="item.start"
                      :dest="item.dest"
                      :time="item.time"
                      :cost="item.cost"
                      :people="item.people"
                      @click="openRideDetail(item.id)"
                    />
                    <div
                      v-if="history.list.length === 0"
                      class="h-full flex items-center justify-center text-slate-300 text-sm"
                    >
                      기록이 없습니다.
                    </div>
                  </div>
                </div>

                <!-- 받은 리뷰 리스트 -->
                <div
                  v-if="activeTab === 'reviews'"
                  class="h-full relative content-fade-wrapper"
                  :class="{
                    'show-top': scrollState.reviews.top,
                    'show-bottom': scrollState.reviews.bottom,
                  }"
                >
                  <div
                    ref="reviewScrollRef"
                    @scroll="checkScroll($event.target, 'reviews')"
                    class="h-full overflow-y-auto custom-scroll p-8 pb-20"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                      <ReviewEntry
                        v-for="item in review.list"
                        :key="item.id"
                        :review="item"
                        @click="openMyReview(item)"
                      />
                    </div>
                    <div
                      v-if="review.list.length === 0"
                      class="h-full flex items-center justify-center text-slate-300 text-sm"
                    >
                      리뷰가 없습니다.
                    </div>
                  </div>
                </div>
              </div>
            </RoundBox>
          </div>
        </div>
      </div>
    </div>

    <!-- 탑승 상세 모달 -->
    <div
      v-if="isRideHistoryModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      @click="isRideHistoryModalOpen = false"
    >
      <div class="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-slate-900 text-left">탑승 상세 정보</h2>
          <button @click="isRideHistoryModalOpen = false">
            <X class="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div class="space-y-4 mb-8">
          <div class="flex justify-between py-2 border-b border-slate-50">
            <span class="text-slate-400 text-sm">경로</span>
            <span class="text-slate-800 font-bold text-sm text-right"
              >{{ currentHistory.start }} → {{ currentHistory.dest }}</span
            >
          </div>
          <div class="flex justify-between py-2 border-b border-slate-50">
            <span class="text-slate-400 text-sm">탑승 시각</span>
            <span class="text-slate-800 font-bold text-sm text-right">{{
              currentHistory.time
            }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-50">
            <span class="text-slate-400 text-sm">결제 금액</span>
            <span class="text-slate-800 font-bold text-sm text-right">{{
              currentHistory.cost
            }}</span>
          </div>
        </div>
        <button
          @click="isRideHistoryModalOpen = false"
          class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
        >
          확인
        </button>
      </div>
    </div>

    <!-- 리뷰 상세 모달 -->
    <div
      v-if="isReviewModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      @click="isReviewModalOpen = false"
    >
      <div class="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-slate-900 text-left">리뷰 상세</h2>
          <button @click="isReviewModalOpen = false">
            <X class="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div
          class="bg-slate-50 p-6 rounded-3xl mb-8 italic text-slate-600 leading-relaxed text-left"
        >
          "{{ currentReview.contents }}"
        </div>
        <button
          @click="isReviewModalOpen = false"
          class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
        >
          확인
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isEditPaymentModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
        @click="isEditPaymentModalOpen = false"
      >
        <div class="w-full max-w-md animate-in fade-in zoom-in duration-300" @click.stop>
          <EditPayment @close="handleEditPaymentModal" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 커스텀 스크롤바 숨기기 */
.custom-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-scroll::-webkit-scrollbar {
  display: none;
}

/* 동적 그라데이션 스타일 */
.content-fade-wrapper::before,
.content-fade-wrapper::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 60px;
  pointer-events: none;
  z-index: 20;
  transition: opacity 0.3s ease;
  opacity: 0;
}

/* 상단 그라데이션 */
.content-fade-wrapper::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
}

/* 하단 그라데이션 */
.content-fade-wrapper::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
}

.show-top::before {
  opacity: 1;
}
.show-bottom::after {
  opacity: 1;
}

.glass-panel {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
</style>
