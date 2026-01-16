<script setup>
import { ref, onMounted, watch } from 'vue' // [중요] watch 필수!

// 부모(Main.vue)에게 받는 데이터
const props = defineProps({
    recruitList: { type: Array, default: () => [] }
})

const emit = defineEmits(['update-location', 'marker-click'])

const mapContainer = ref(null)
const mapInstance = ref(null)
const myMarker = ref(null)
const recruitMarkers = ref([]) // 모집글 마커 관리용 배열

// 초기 위치 (강남역 부근)
const lat = ref(37.498095)
const lng = ref(127.02761)

onMounted(() => {
    if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(lat.value, lng.value),
                level: 3
            }
            mapInstance.value = new window.kakao.maps.Map(mapContainer.value, options)

            initGeolocation()

            // 처음 로드될 때 데이터가 있으면 마커 찍기
            if (props.recruitList.length > 0) {
                updateRecruitMarkers()
            }
        })
    }
})

// [핵심] recruitList가 변하면(글이 추가되면) 마커를 다시 그립니다.
watch(() => props.recruitList, () => {
    updateRecruitMarkers()
}, { deep: true })

// --- 모집글 마커 업데이트 함수 ---
const updateRecruitMarkers = () => {
    if (!mapInstance.value) return

    // 1. 기존 마커들 삭제 (초기화)
    recruitMarkers.value.forEach(marker => marker.setMap(null))
    recruitMarkers.value = []

    // 2. 새 리스트로 마커 생성
    props.recruitList.forEach(recruit => {
        // 좌표가 없으면 생성 안 함
        // Main.vue 데이터와 변수명(startLat, startLng)이 일치해야 함!
        if (!recruit.startLat || !recruit.startLng) return

        const loc = new window.kakao.maps.LatLng(recruit.startLat, recruit.startLng)

        // 마커 디자인 (HTML)
        const content = document.createElement('div')
        content.className = 'marker-pin'
        content.innerHTML = `
      <div class="pin-head">
        <span class="text-xs font-bold">${recruit.cur}/${recruit.max}</span>
      </div>
      <div class="pin-tail"></div>
    `

        // 마커 클릭 시 이벤트 발생
        content.addEventListener('click', () => {
            emit('marker-click', recruit)
        })

        const overlay = new window.kakao.maps.CustomOverlay({
            map: mapInstance.value,
            position: loc,
            content: content,
            yAnchor: 1,
            zIndex: 50
        })

        recruitMarkers.value.push(overlay)
    })
}

// --- 내 위치 및 지도 제어 함수들 (기존 유지) ---
const initGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
            lat.value = pos.coords.latitude
            lng.value = pos.coords.longitude
            updateMyMarker()
            emit('update-location', { lat: lat.value, lng: lng.value })
        }, null, { enableHighAccuracy: true })
    }
}

const updateMyMarker = () => {
    if (!mapInstance.value || !window.kakao) return
    const loc = new window.kakao.maps.LatLng(lat.value, lng.value)

    if (!myMarker.value) {
        const content = '<div class="w-6 h-6 bg-indigo-600 rounded-full border-[3px] border-white shadow-lg pulse-animation"></div>'
        myMarker.value = new window.kakao.maps.CustomOverlay({
            map: mapInstance.value,
            position: loc,
            content: content,
            yAnchor: 0.5,
            zIndex: 100
        })
        mapInstance.value.panTo(loc)
    } else {
        myMarker.value.setPosition(loc)
    }
}

const zoomIn = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() - 1)
const zoomOut = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() + 1)
const panToCurrent = () => {
    if (mapInstance.value) {
        mapInstance.value.panTo(new window.kakao.maps.LatLng(lat.value, lng.value))
    }
}

const moveToLocation = (targetLat, targetLng) => {
    if (mapInstance.value && targetLat && targetLng) {
        const loc = new window.kakao.maps.LatLng(targetLat, targetLng)
        mapInstance.value.panTo(loc)
    }
}

defineExpose({ zoomIn, zoomOut, panToCurrent, moveToLocation })
</script>

<template>
    <div ref="mapContainer" class="absolute inset-0 w-full h-full z-0"></div>
</template>

<style>
/* 전역 스타일 */
.pulse-animation {
    animation: pulse 2s infinite;
}

/* 모집글 마커 스타일 */
.marker-pin {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
    transition: transform 0.2s;
}

.marker-pin:hover {
    transform: scale(1.1) translateY(-5px);
    z-index: 100;
}

.pin-head {
    width: 40px;
    height: 40px;
    background-color: #f43f5e;
    /* Rose-500 */
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.pin-tail {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #f43f5e;
    margin-top: -2px;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
    }
}
</style>