<script setup>
import { ref, onMounted } from 'vue'

// 부모에게 보낼 신호 (내 위치 업데이트)
const emit = defineEmits(['update-location'])

const mapContainer = ref(null)
const mapInstance = ref(null)
const myMarker = ref(null)

// 내부 상태 (위치)
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
        })
    }
})

// 위치 추적 로직
const initGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
            lat.value = pos.coords.latitude
            lng.value = pos.coords.longitude

            // 마커 업데이트 및 부모에게 위치 알림
            updateMyMarker()
            emit('update-location', { lat: lat.value, lng: lng.value })
        }, null, { enableHighAccuracy: true })
    }
}

// 마커 그리기 로직
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

// --- 부모(HomeView)에서 호출할 수 있는 함수들 ---
const zoomIn = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() - 1)
const zoomOut = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() + 1)
const panToCurrent = () => {
    if (mapInstance.value) {
        mapInstance.value.panTo(new window.kakao.maps.LatLng(lat.value, lng.value))
    }
}

// 함수 노출 (필수!)
defineExpose({ zoomIn, zoomOut, panToCurrent })
</script>

<template>
    <div ref="mapContainer" class="absolute inset-0 w-full h-full z-0"></div>
</template>

<style>
/* 마커 애니메이션 */
.pulse-animation {
    animation: pulse 2s infinite;
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