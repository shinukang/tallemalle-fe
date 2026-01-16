<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Radio } from 'lucide-vue-next'

import DriverIncomeWidget from '@/components/driver/DriverIncomeWidget.vue'
import DriverMapControls from '@/components/driver/DriverMapControls.vue'
import DriverNavHeader from '@/components/driver/DriverNavHeader.vue'
import DriverPickupSheet from '@/components/driver/DriverPickupSheet.vue'
import DriverCallModal from '@/components/driver/DriverCallModal.vue'

defineEmits(['open-nav'])

// --- 상태 변수 ---
const isDriving = ref(false)
const isTrafficOn = ref(false)
const showCallModal = ref(false)
const showPickupSheet = ref(false)
const currentFare = ref(4800)
const todayIncome = ref(124000) // 수입 상태 변수 추가
const naviTitle = ref('운행 대기 중')
const naviSub = ref('주변의 콜을 기다리세요')
const etaText = ref('--분')

// --- 지도/소켓 관련 ---
const userId = ref('driver_' + Math.random().toString(36).substring(7))
let map = null
let driverMarker = null
let socket = null
let myLat = 37.3948
let myLng = 127.1112

// --- 웹소켓 로직 ---
const connectWebSocket = () => {
  const socketUrl = `ws://127.0.0.1:8080/ws/chat`
  socket = new WebSocket(socketUrl)
  socket.onmessage = (e) => console.log('📩', JSON.parse(e.data))
  socket.onclose = () => setTimeout(connectWebSocket, 3000)
}

// --- 생명주기 훅 ---
onMounted(() => {
  connectWebSocket()
  const KAKAO_KEY = 'f37807b77cb80bec5b35db61d2ad7dba'
  const script = document.createElement('script')
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_KEY}&libraries=services`
  script.onload = () => window.kakao.maps.load(() => initMap())
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (socket) socket.close()
})

// --- 지도 초기화 ---
const initMap = () => {
  const container = document.getElementById('map')
  map = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(myLat, myLng),
    level: 4,
  })
  driverMarker = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(myLat, myLng),
    content: '<div class="car-marker"></div>',
    map: map,
  })
}

// --- 이벤트 핸들러 ---
const triggerCall = () => (showCallModal.value = true)

const acceptCall = () => {
  showCallModal.value = false
  showPickupSheet.value = true
}

const startNavigation = () => {
  showPickupSheet.value = false
  isDriving.value = true
  naviTitle.value = '강남역 가는 길'
  naviSub.value = '안전 운전 하세요'
  etaText.value = '15분'
}

const toggleTraffic = () => {
  isTrafficOn.value = !isTrafficOn.value
  isTrafficOn.value
    ? map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)
    : map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)
}

const recenterMap = () => {
  if (driverMarker && map) {
    map.panTo(driverMarker.getPosition())
  }
}
</script>

<template>
  <div class="h-full w-full relative bg-slate-900 overflow-hidden font-pretendard">
    <div id="map" class="w-full h-full kakao-dark-mode absolute inset-0 z-0"></div>

    <DriverNavHeader
      :is-driving="isDriving"
      :title="naviTitle"
      :sub-title="naviSub"
      :eta="etaText"
      :fare="currentFare"
    />

    <DriverIncomeWidget v-if="!isDriving" :income="todayIncome" />

    <div
      class="absolute right-4 top-28 z-20 transition-opacity duration-300"
      :class="{ 'opacity-0 pointer-events-none': isDriving }"
    >
      <DriverMapControls
        :is-traffic-on="isTrafficOn"
        @toggle-traffic="toggleTraffic"
        @recenter="recenterMap"
      />
    </div>

    <div
      v-if="!isDriving && !showPickupSheet"
      class="absolute inset-x-0 bottom-8 flex justify-center z-20 pointer-events-none pb-safe"
    >
      <button
        @click="triggerCall"
        class="pointer-events-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse active:scale-95"
      >
        <Radio class="w-8 h-8" />
      </button>
    </div>

    <DriverPickupSheet
      :show="showPickupSheet"
      passenger-name="김손님 고객"
      location="경기도 성남시 분당구 판교역로 152"
      @start-drive="startNavigation"
    />

    <DriverCallModal :show="showCallModal" @accept="acceptCall" @reject="showCallModal = false" />
  </div>
</template>

<style scoped>
.kakao-dark-mode {
  filter: invert(90%) hue-rotate(180deg) brightness(105%) contrast(95%);
}

:deep(.car-marker) {
  width: 40px;
  height: 40px;
  background: #6366f1;
  clip-path: polygon(50% 0%, 15% 100%, 50% 80%, 85% 100%);
  border: 2px solid white;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
