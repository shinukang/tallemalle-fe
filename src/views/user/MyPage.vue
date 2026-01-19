<script setup>
import { ref, reactive, onMounted } from 'vue'
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
import EditPayment from '@/views/payment/EditPayment.vue'
import HistoryEntry from '@/components/entry/HistoryEntry.vue'

// --- 상태 ---
const activeTab = ref('history') // 'history' | 'reviews'
const isRideHistoryModalOpen = ref(false)
const isEditPaymentModalOpen = ref(false)
const isReviewModalOpen = ref(false)
const currentHistory = ref({})
const currentReview = ref({})
const profileImage = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')

const history = reactive({
  list: [],
})
const review = reactive({
  list: [],
})

// --- 메소드 ---
const switchTab = (tab) => {
  activeTab.value = tab
}

const openRideDetail = (id) => {
  // 실제로는 ID로 API 호출하거나 리스트에서 찾음
  currentHistory.value = rideHistoryList.find((item) => item.id === id) || rideHistoryList[0]
  isRideHistoryModalOpen.value = true
}

const openMyReview = (name, content, stars) => {
  currentReview.value = { name, content, stars }
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
      console.log(res.data)
      history.list = res.data
    }
  } catch (error) {
    console.error('HISTORY: ', error)
  }
}

const getReview = async () => {
  try {
    const res = await api.review()
    if (res.data) {
      console.log(res.data)
      review.list = res.data
    }
  } catch (error) {
    console.error('REVIEW: ', error)
  }
}

onMounted(async () => {
  getHistory()
  getReview()
})
</script>

<template>
  <div class="h-full flex gap-4 p-4 overflow-hidden relative">
    <div class="hidden md:block w-20 shrink-0"></div>

    <div
      class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden bg-white/90 backdrop-blur border border-white/50 shadow-xl"
    >
      <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">마이페이지</h1>
          <p class="text-sm text-slate-400 font-medium mt-1">
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

      <div class="flex-1 overflow-y-auto custom-scroll p-8">
        <div class="max-w-6xl mx-auto grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
            <div
              class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden"
            >
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
              <p class="text-xs text-slate-400 mb-6">pangyo_king@gmail.com</p>
              <RouterLink to="/editprofile">
                <button
                  class="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                >
                  개인정보 수정
                </button>
              </RouterLink>
            </div>

            <div class="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm">
              <div class="flex justify-between items-start mb-4">
                <div>
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
            </div>

            <div class="flex-1"></div>
            <div class="pt-4 flex justify-center mt-auto">
              <button
                class="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-all font-bold text-[11px]"
              >
                <UserMinus class="w-3.5 h-3.5" />
                탈래말래 탈퇴하기
              </button>
            </div>
          </div>

          <div class="col-span-12 lg:col-span-8 space-y-6">
            <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-slate-900 flex items-center gap-2">
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
                    <div>
                      <p class="text-xs font-bold">신한카드 (4215)</p>
                      <p class="text-[10px] text-slate-400">기본 결제 수단</p>
                    </div>
                  </div>
                  <CheckCircle2 class="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]"
            >
              <div class="flex border-b border-slate-50">
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
                  <span class="ml-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">2</span>
                </button>
              </div>

              <div
                v-if="activeTab === 'history'"
                class="flex-1 overflow-y-auto custom-scroll p-6 space-y-4"
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
              </div>

              <div v-if="activeTab === 'reviews'" class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all"
                  >
                    <div class="flex items-center gap-3 mb-4">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna"
                        class="w-10 h-10 rounded-full bg-white border"
                      />
                      <div>
                        <p class="text-xs font-bold text-slate-800">루나님</p>
                        <p class="text-[10px] text-slate-400">강남역 → 판교역</p>
                      </div>
                    </div>
                    <Quote class="absolute top-6 right-6 w-4 h-4 text-slate-200" />
                    <p class="text-sm text-slate-600 leading-relaxed italic">
                      "시간 약속을 정말 칼같이 지키셔서 너무 좋았어요!"
                    </p>
                    <div class="mt-4 flex gap-1">
                      <Star v-for="i in 5" :key="i" class="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isRideHistoryModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      @click="isRideHistoryModalOpen = false"
    >
      <div class="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">탑승 상세 정보</h2>
          <button @click="isRideHistoryModalOpen = false">
            <X class="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <p class="text-slate-600 mb-8">
          {{ currentHistory.start }}에서 {{ currentHistory.dest }}까지의 여정입니다.
        </p>
        <button
          @click="isRideHistoryModalOpen = false"
          class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
        >
          닫기
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
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
