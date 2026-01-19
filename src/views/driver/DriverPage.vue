<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Radio, AlertCircle } from 'lucide-vue-next'
import driverApi from '@/api/user'

import DriverLogoHeader from '@/components/driver/DriverLogoHeader.vue'
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
const todayIncome = ref(124000)
const naviTitle = ref('운행 대기 중')
const naviSub = ref('주변의 콜을 기다리세요')
const etaText = ref('--분')
const errorMessage = ref('')
const carRotation = ref(0) // 차량 회전 각도

// 콜 정보
const callInfo = ref({
  departure: '',
  destination: '',
  path: []
})

// --- 지도 관련 변수 ---
let map = null
let driverMarker = null
let polyline = null
let socket = null
let driveInterval = null

// 초기 위치 (신대방삼거리역)
let myLat = 37.499935
let myLng = 126.927324

// 실제 도로 경로 데이터 (신대방삼거리 -> 당산)
const REAL_ROAD_PATH = [
  { lat: 37.499935, lng: 126.927324 }, // 신대방삼거리
  { lat: 37.500500, lng: 126.927000 },
  { lat: 37.501200, lng: 126.926600 },
  { lat: 37.502500, lng: 126.925800 },
  { lat: 37.503600, lng: 126.925100 },
  { lat: 37.504800, lng: 126.924400 },
  { lat: 37.506500, lng: 126.923400 },
  { lat: 37.508500, lng: 126.922200 },
  { lat: 37.510500, lng: 126.921000 },
  { lat: 37.512000, lng: 126.920100 },
  { lat: 37.513500, lng: 126.919200 },
  { lat: 37.514800, lng: 126.918400 }, // 대방역 지하차도
  { lat: 37.516000, lng: 126.917500 },
  { lat: 37.517000, lng: 126.916000 }, // 여의교
  { lat: 37.517500, lng: 126.914500 },
  { lat: 37.518000, lng: 126.913000 },
  { lat: 37.518800, lng: 126.911000 },
  { lat: 37.519500, lng: 126.909000 },
  { lat: 37.521000, lng: 126.908000 },
  { lat: 37.523000, lng: 126.907000 }, // 노들로
  { lat: 37.525000, lng: 126.906200 },
  { lat: 37.527000, lng: 126.905500 },
  { lat: 37.529000, lng: 126.904500 },
  { lat: 37.531000, lng: 126.903800 },
  { lat: 37.533000, lng: 126.903000 },
  { lat: 37.534600, lng: 126.902700 } // 당산역
]

// --- 웹소켓 ---
const connectWebSocket = () => {
  const socketUrl = `ws://127.0.0.1:8080/ws/chat`
  socket = new WebSocket(socketUrl)
  socket.onmessage = (e) => console.log('📩', JSON.parse(e.data))
  socket.onclose = () => setTimeout(connectWebSocket, 3000)
}

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
  if (driveInterval) clearInterval(driveInterval)
})

const initMap = () => {
  const container = document.getElementById('map')
  map = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(myLat, myLng),
    level: 4,
  })
  driverMarker = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(myLat, myLng),
    content: `
      <div class="car-marker-container">
        <div id="car-body" class="car-marker"></div>
      </div>
    `,
    map: map,
  })
}

const calculateBearing = (startLat, startLng, endLat, endLng) => {
  const startLatRad = startLat * (Math.PI / 180)
  const startLngRad = startLng * (Math.PI / 180)
  const endLatRad = endLat * (Math.PI / 180)
  const endLngRad = endLng * (Math.PI / 180)
  const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad)
  const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
    Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad)
  const brng = Math.atan2(y, x)
  return (brng * 180 / Math.PI + 360) % 360
}

const subdividePath = (pathData, splitCount = 50) => {
  const smoothPath = []
  for (let i = 0; i < pathData.length - 1; i++) {
    const start = pathData[i]
    const end = pathData[i + 1]
    const bearing = calculateBearing(start.lat, start.lng, end.lat, end.lng)
    for (let j = 0; j < splitCount; j++) {
      const lat = start.lat + (end.lat - start.lat) * (j / splitCount)
      const lng = start.lng + (end.lng - start.lng) * (j / splitCount)
      smoothPath.push({ lat, lng, bearing })
    }
  }
  return smoothPath
}

const showToastError = (msg) => {
  errorMessage.value = msg
  setTimeout(() => { errorMessage.value = '' }, 3000)
}

const triggerCall = async () => {
  errorMessage.value = ''
  try {
    const res = await driverApi.getNavigationPath()
    if (res && res.data) {
      callInfo.value = {
        departure: res.data.departure || '알 수 없는 출발지',
        destination: res.data.destination || '알 수 없는 도착지',
        path: res.data.path || []
      }
      showCallModal.value = true
    } else {
      throw new Error('No Data')
    }
  } catch (error) {
    // API 실패 시 Fallback (실제 도로 데이터 사용)
    callInfo.value = {
      departure: '신대방삼거리역',
      destination: '당산역',
      path: REAL_ROAD_PATH
    }
    showCallModal.value = true
    showToastError('⚠️ 테스트용 경로를 불러왔습니다.')
  }
}

const acceptCall = () => {
  showCallModal.value = false
  showPickupSheet.value = true
}

const startNavigation = () => {
  showPickupSheet.value = false
  isDriving.value = true
  naviTitle.value = '목적지로 이동 중'
  naviSub.value = '안전 운전 하세요'

  if (callInfo.value.path && callInfo.value.path.length > 0) {
    runDriveSimulation(callInfo.value.path)
  } else {
    showToastError("경로 데이터가 없어 안내를 시작할 수 없습니다.")
  }
}

const runDriveSimulation = (pathData) => {
  etaText.value = '15분'
  const linePath = pathData.map(p => new window.kakao.maps.LatLng(p.lat, p.lng))

  if (polyline) polyline.setMap(null)
  polyline = new window.kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 6,
    strokeColor: '#6366f1',
    strokeOpacity: 0.8,
    strokeStyle: 'solid'
  })
  polyline.setMap(map)

  const bounds = new window.kakao.maps.LatLngBounds()
  linePath.forEach(p => bounds.extend(p))
  map.setBounds(bounds)

  const smoothPath = subdividePath(pathData, 50)
  let index = 0
  if (driveInterval) clearInterval(driveInterval)

  driveInterval = setInterval(() => {
    if (index >= smoothPath.length) {
      clearInterval(driveInterval)
      naviTitle.value = '도착'
      naviSub.value = '운행이 종료되었습니다.'
      isDriving.value = false
      return
    }
    const currentPoint = smoothPath[index]
    const currentPos = new window.kakao.maps.LatLng(currentPoint.lat, currentPoint.lng)
    driverMarker.setPosition(currentPos)

    const carElement = document.getElementById('car-body')
    if (carElement) {
      carElement.style.transform = `rotate(${currentPoint.bearing}deg)`
    }
    if (index % 10 === 0) map.panTo(currentPos)
    index++
  }, 30)
}

const toggleTraffic = () => {
  isTrafficOn.value = !isTrafficOn.value
  isTrafficOn.value
    ? map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)
    : map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)
}

const recenterMap = () => {
  if (driverMarker && map) map.panTo(driverMarker.getPosition())
}
</script>

<template>
  <div class="h-full w-full relative bg-slate-900 overflow-hidden font-pretendard">
    <div id="map" class="w-full h-full kakao-dark-mode absolute inset-0 z-0"></div>

    <DriverNavHeader :is-driving="isDriving" :title="naviTitle" :sub-title="naviSub" :eta="etaText"
      :fare="currentFare" />

    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
      <DriverLogoHeader v-if="!isDriving" />
    </transition>

    <Transition enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-10 opacity-0">
      <div v-if="errorMessage"
        class="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-rose-950/90 border border-rose-500/50 text-rose-200 rounded-full shadow-lg backdrop-blur-sm whitespace-nowrap">
        <AlertCircle class="w-5 h-5 text-rose-500" />
        <span class="text-sm font-bold">{{ errorMessage }}</span>
      </div>
    </Transition>

    <div v-if="!isDriving" class="absolute top-6 right-4 z-20">
      <DriverIncomeWidget :income="todayIncome" />
    </div>

    <div class="absolute right-4 top-28 z-20 transition-opacity duration-300"
      :class="{ 'opacity-0 pointer-events-none': isDriving }">
      <DriverMapControls :is-traffic-on="isTrafficOn" @toggle-traffic="toggleTraffic" @recenter="recenterMap" />
    </div>

    <div v-if="!isDriving && !showPickupSheet"
      class="absolute inset-x-0 bottom-8 flex justify-center z-20 pointer-events-none pb-safe">
      <button @click="triggerCall"
        class="pointer-events-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse active:scale-95">
        <Radio class="w-8 h-8" />
      </button>
    </div>

    <DriverPickupSheet :show="showPickupSheet" passenger-name="김손님 고객" :location="callInfo.departure || '위치 정보 확인 중'"
      @start-drive="startNavigation" />

    <DriverCallModal :show="showCallModal" :departure="callInfo.departure" :destination="callInfo.destination"
      @accept="acceptCall" @reject="showCallModal = false" />
  </div>
</template>

<style scoped>
.kakao-dark-mode {
  filter: invert(90%) hue-rotate(180deg) brightness(105%) contrast(95%);
}

:deep(.car-marker-container) {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.car-marker) {
  width: 20px;
  height: 40px;
  background: #6366f1;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  transition: transform 0.1s linear;
}

:deep(.car-marker)::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 2px;
  right: 2px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>