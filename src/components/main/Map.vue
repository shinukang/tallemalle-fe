<script setup>
import { ref, onMounted, watch } from 'vue' // [중요] watch 필수!

// 부모(Main.vue)에게 받는 데이터
const props = defineProps({
    recruitList: { type: Array, default: () => [] },
    // 중심 이동 오프셋 (px 단위)
    centerOffset: { type: Number, default: 0 }
})

const emit = defineEmits(['update-location', 'marker-click', 'update-visible-list'])

const mapContainer = ref(null)
const mapInstance = ref(null)
const myMarker = ref(null)
const recruitMarkers = ref(new Map()) // ID를 키로 관리하는 Map

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

            window.kakao.maps.event.addListener(mapInstance.value, 'idle', () => {
                updateVisibleMarkers()
            })
            // 처음 로드될 때 데이터가 있으면 마커 찍기
            if (props.recruitList.length > 0) {
                updateRecruitMarkers()
            }
        })
    }
})

// [핵심 기능] 오프셋을 적용한 좌표 이동 함수
const moveWithOffset = (targetLat, targetLng) => {
    if (!mapInstance.value || !targetLat || !targetLng) return

    const map = mapInstance.value
    const targetPosition = new window.kakao.maps.LatLng(targetLat, targetLng)

    // 오프셋이 없으면 그냥 이동
    if (props.centerOffset === 0) {
        map.panTo(targetPosition)
        return
    }

    // [카카오 지도 Projection 사용]
    // 1. 위도/경도를 화면상의 픽셀 좌표(Point)로 변환
    const projection = map.getProjection()
    const targetPoint = projection.pointFromCoords(targetPosition)

    // 2. 오프셋만큼 중심점을 왼쪽(-)으로 이동
    // (지도의 중심을 왼쪽으로 옮겨야, 우리가 원하는 타겟 마커가 화면 오른쪽에 옴)
    const newCenterPoint = new window.kakao.maps.Point(
        targetPoint.x - props.centerOffset,
        targetPoint.y
    )

    // 3. 다시 픽셀 좌표를 위도/경도로 변환
    const newCenterPosition = projection.coordsFromPoint(newCenterPoint)

    // 4. 이동
    map.panTo(newCenterPosition)
}

// recruitList가 변하면(글이 추가되면) 마커를 다시 그립니다.
watch(() => props.recruitList, () => {
    updateRecruitMarkers()
}, {
    deep: true
})

const updateVisibleMarkers = () => {
    // Map size 체크
    if (!mapInstance.value || recruitMarkers.value.size === 0) {
        return
    }

    // 현재 지도의 영역(Bounds) 가져오기
    const bounds = mapInstance.value.getBounds()
    // 화면에 보이는 모집글 ID들을 담을 배열
    const visibleIds = []

    // Map.forEach는 (value, key) 순서로 들어옴 value가 마커 객체
    recruitMarkers.value.forEach((marker) => {
        // 마커의 위치가 현재 영역 안에 있는지 확인 (카카오 API 제공)
        if (bounds.contain(marker.getPosition())) {
            // 영역 안이면 보이기
            if (!marker.getMap()) {
                marker.setMap(mapInstance.value)
            }
            // 보이는 마커의 ID를 배열에 추가
            if (marker.recruitId) {
                visibleIds.push(marker.recruitId)
            }
        } else {
            // 영역 밖이면 숨기기
            if (marker.getMap()) {
                marker.setMap(null)
            }
        }
    })

    emit('update-visible-list', visibleIds)
}

// --- 모집글 마커 업데이트 함수 (Diffing 로직 적용) ---
const updateRecruitMarkers = () => {
    if (!mapInstance.value) return

    // 새로운 데이터의 ID 목록을 Set으로 만들기
    const newRecruitIds = new Set(props.recruitList.map(r => r.id))

    // 리스트에 없는 마커 제거
    // recruitMarkers Map을 순회하면서 검사
    for (const [id, marker] of recruitMarkers.value) {
        if (!newRecruitIds.has(id)) {
            // 지도에서 제거
            marker.setMap(null)
            // 메모리에서 제거
            recruitMarkers.value.delete(id)
        }
    }

    // 리스트에는 있는데 맵에 없는 마커 생성
    props.recruitList.forEach(recruit => {
        // 이미 존재하는 마커면 건너뛰기
        if (recruitMarkers.value.has(recruit.id)) {
            return
        }

        // 좌표 유효성 검사
        if (!recruit.startLat || !recruit.startLng) {
            return
        }

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
            position: loc,
            content: content,
            yAnchor: 1,
            zIndex: 50
        })

        // 지도에 표시하고 Map에 저장
        overlay.setMap(mapInstance.value)
        overlay.recruitId = recruit.id // visible 체크용 ID 주입

        recruitMarkers.value.set(recruit.id, overlay)
    })
    // 보이는 목록 갱신
    updateVisibleMarkers()
}

// --- 내 위치 및 지도 제어 함수들 (기존 유지) ---
// === 상황 :     브라우저에서 사용자가 "위치 정보 제공"을 거부(Block) 했을 때, 지도가 멈추거나 내 위치 마커가 생성되지 않습니다. ===
// === 해결 방법: Map.vue에서 에러 콜백을 처리하고, Main.vue로 신호를 보내 사용자에게 "위치 권한이 필요합니다"라고 알려줘야 합니다. ===
const initGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
            lat.value = pos.coords.latitude
            lng.value = pos.coords.longitude
            updateMyMarker()
            emit('update-location', { lat: lat.value, lng: lng.value })
        }, (error) => {
            console.warn("위치 정보를 가져올 수 없습니다.", error.message)
        }, { enableHighAccuracy: true, timeout: 5000 })
    } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.")
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
        moveWithOffset(lat.value, lng.value)
    } else {
        myMarker.value.setPosition(loc)
    }
}

// 줌 인 버튼
const zoomIn = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() - 1)
// 줌 아웃 버튼
const zoomOut = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() + 1)
// 내 위치로 이동 버튼
const panToCurrent = () => {
    moveWithOffset(lat.value, lng.value)
}

const moveToLocation = (targetLat, targetLng) => {
    moveWithOffset(targetLat, targetLng)
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