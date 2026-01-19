<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Radio } from 'lucide-vue-next'
import driverApi from '@/api/driver'
import { useWebSocket } from '@/composables/useWebSocket'
import taxiImg from '@/assets/images/taxi.png'

import DriverLogoHeader from '@/components/driver/DriverLogoHeader.vue'
import DriverIncomeWidget from '@/components/driver/DriverIncomeWidget.vue'
import DriverMapControls from '@/components/driver/DriverMapControls.vue'
import DriverNavHeader from '@/components/driver/DriverNavHeader.vue'
import DriverPickupSheet from '@/components/driver/DriverPickupSheet.vue'
import DriverCallModal from '@/components/driver/DriverCallModal.vue'

const { connect, sendMessage, isConnected } = useWebSocket()

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
const passengerName = ref('손님')

const callInfo = ref({ departure: '', destination: '', path: [] })

let map = null
let driverMarker = null
let polyline = null
let driveInterval = null
let myLat = 37.499935
let myLng = 126.927324

// 메시지 수신 핸들러
const handleSocketMessage = (e) => {
  try {
    let data = JSON.parse(e.data)

    if (data.payload && typeof data.payload === 'string') {
      try { data = JSON.parse(data.payload) } catch (e) { }
    }

    if (data.type === 'newRecruit' || data.type === 'createRecruit') {
      if (data.payload) {
        callInfo.value.departure = data.payload.start || callInfo.value.departure
        callInfo.value.destination = data.payload.dest || callInfo.value.destination
        if (data.payload.nickname) {
          passengerName.value = data.payload.nickname + ' 고객'
        }
      }
      triggerCall()
    }
  } catch (err) { console.error(err) }
}

onMounted(() => {
  const baseUrl = import.meta.env.VITE_WS_URL
  const socketUrl = `${baseUrl}`
  connect(socketUrl, handleSocketMessage)

  const KAKAO_KEY = 'f37807b77cb80bec5b35db61d2ad7dba'
  const script = document.createElement('script')
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_KEY}&libraries=services`
  script.onload = () => window.kakao.maps.load(() => initMap())
  document.head.appendChild(script)
})

onUnmounted(() => {
  if (driveInterval) clearInterval(driveInterval)
})

const initMap = () => {
  const container = document.getElementById('map')
  map = new window.kakao.maps.Map(container, { center: new window.kakao.maps.LatLng(myLat, myLng), level: 4 })

  // CustomOverlay 내용을 이미지 태그로 변경
  driverMarker = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(myLat, myLng),
    content: `
      <div class="car-marker-container">
        <img id="car-body" src="${taxiImg}" class="car-image" alt="Taxi Marker" />
      </div>
    `,
    map: map,
  })
}

const triggerCall = async () => {
  try {
    const res = await driverApi.getNavigationPath()
    const naviData = res.data
    if (naviData && naviData.path) {
      callInfo.value = {
        departure: callInfo.value.departure || naviData.departure || '출발지',
        destination: callInfo.value.destination || naviData.destination || '도착지',
        path: naviData.path
      }
      showCallModal.value = true
    } else { throw new Error('Invalid Data') }
  } catch (error) {
    showCallModal.value = true; showToastError('경로 데이터 로드 실패')
  }
}

const acceptCall = () => { showCallModal.value = false; showPickupSheet.value = true }

const startNavigation = () => {
  showPickupSheet.value = false
  isDriving.value = true
  naviTitle.value = '목적지로 이동 중'
  naviSub.value = '안전 운전 하세요'

  if (callInfo.value.path?.length > 0) {
    if (isConnected.value) {
      sendMessage({ type: 'drivingPath', payload: callInfo.value.path })
    }
    runDriveSimulation(callInfo.value.path)
  }
}

const runDriveSimulation = (pathData) => {
  etaText.value = '15분'
  const linePath = pathData.map(p => new window.kakao.maps.LatLng(p.lat, p.lng))
  if (polyline) polyline.setMap(null)
  polyline = new window.kakao.maps.Polyline({
    path: linePath, strokeWeight: 6, strokeColor: '#6366f1', strokeOpacity: 0.8, strokeStyle: 'solid'
  })
  polyline.setMap(map)

  const bounds = new window.kakao.maps.LatLngBounds()
  linePath.forEach(p => bounds.extend(p))
  map.setBounds(bounds)

  const splitCount = 200
  const smoothPath = subdividePath(pathData, splitCount)

  let index = 0
  if (driveInterval) clearInterval(driveInterval)

  driveInterval = setInterval(() => {
    if (index >= smoothPath.length) {
      clearInterval(driveInterval)
      naviTitle.value = '도착'; naviSub.value = '운행 종료'; isDriving.value = false
      return
    }

    const currentPoint = smoothPath[index]
    const pos = new window.kakao.maps.LatLng(currentPoint.lat, currentPoint.lng)

    driverMarker.setPosition(pos)

    // 이미지 회전 (id="car-body"를 찾아 회전시킴)
    const carEl = document.getElementById('car-body')
    if (carEl) carEl.style.transform = `rotate(${currentPoint.bearing || 0}deg)`

    if (index % 20 === 0) map.panTo(pos)

    if (index % 20 === 0 && isConnected.value) {
      sendMessage({
        type: 'driverLocation',
        payload: {
          lat: currentPoint.lat,
          lng: currentPoint.lng,
          bearing: currentPoint.bearing || 0
        }
      })
    }
    index++
  }, 20)
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

const subdividePath = (pathData, splitCount) => {
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

const toggleTraffic = () => {
  isTrafficOn.value = !isTrafficOn.value
  isTrafficOn.value ? map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC) : map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)
}
const recenterMap = () => { if (driverMarker && map) map.panTo(driverMarker.getPosition()) }

const showToastError = (msg) => {
  errorMessage.value = msg
  setTimeout(() => { errorMessage.value = '' }, 3000)
}
</script>

<template>
  <div class="h-full w-full relative bg-slate-900 overflow-hidden font-pretendard">
    <div id="map" class="w-full h-full kakao-dark-mode absolute inset-0 z-0"></div>
    <DriverNavHeader :is-driving="isDriving" :title="naviTitle" :sub-title="naviSub" :eta="etaText"
      :fare="currentFare" />
    <DriverLogoHeader v-if="!isDriving" />
    <div v-if="!isDriving" class="absolute top-6 right-4 z-20">
      <DriverIncomeWidget :income="todayIncome" />
    </div>
    <div class="absolute right-4 top-28 z-20">
      <DriverMapControls :is-traffic-on="isTrafficOn" @toggle-traffic="toggleTraffic" @recenter="recenterMap" />
    </div>
    <div v-if="!isDriving && !showPickupSheet"
      class="absolute inset-x-0 bottom-8 flex justify-center z-20 pointer-events-none pb-safe">
      <button @click="triggerCall"
        class="pointer-events-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse active:scale-95">
        <Radio class="w-8 h-8" />
      </button>
    </div>
    <DriverPickupSheet :show="showPickupSheet" :passenger-name="passengerName"
      :location="callInfo.departure || '위치 정보 확인 중'" @start-drive="startNavigation" />
    <DriverCallModal :show="showCallModal" :departure="callInfo.departure" :destination="callInfo.destination"
      @accept="acceptCall" @reject="showCallModal = false" />
  </div>
</template>

<style scoped>
.kakao-dark-mode {
  filter: invert(90%) hue-rotate(180deg) brightness(105%) contrast(95%);
}

:deep(.car-marker-container) {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

:deep(.car-image) {
  width: 40px;
  height: auto;
  transition: transform 0.1s linear;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>