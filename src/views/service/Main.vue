<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/main/index.js'

// 컴포넌트 import
import Map from '@/components/main/Map.vue'
import RecruitListPanel from '@/components/main/RecruitListPanel.vue'
import RecruitDetailPanel from '@/components/main/RecruitDetailPanel.vue'
import CreateRecruitModal from '@/components/main/CreateRecruitModal.vue'
import MapControls from '@/components/main/MapControls.vue'
import BottomActionBar from '@/components/main/BottomActionBar.vue'

const router = useRouter()
const authStore = useAuthStore()

// --- 지도 제어용 Ref ---
const mapComponent = ref(null) // TheMap 컴포넌트에 접근하기 위한 변수

// --- 데이터 상태 ---
const myLat = ref(37.498095)
const myLng = ref(127.02761)
const isPanelOpen = ref(false)
const displayRoute = ref('경로 미지정')
const isSocketConnected = ref(false)
const recruitList = ref([])
const visibleRecruitIds = ref([]);
const selectedRecruit = ref(null)
const isDetailOpen = ref(false)
const isCreateModalOpen = ref(false)

// --- 사용자 상태 관리 (LocalStorage 연동) ---
// status: 'IDLE'(기본), 'OWNER'(모집장), 'JOINED'(참여자)
const myStatus = ref(localStorage.getItem('myStatus') || 'IDLE')
const myRecruitId = ref(Number(localStorage.getItem('myRecruitId')) || null)

let ws = null

// ===================================================
// ============== 페이지 접속 및 퇴장 =================
// ===================================================

// --- 초기화 ---
onMounted(async () => {
    // 로그인 안한 사용자면 Login.vue로 이동
    if (!authStore.user) {
        router.push('/login');
        return
    }

    // 소켓 통신 연결 함수
    connectWebSocket()

    // 비동기로 데이터 가져오기
    await fetchRecruits()

    // 만약 이미 참여/모집 중이라면 해당 방의 정보를 찾아두거나 채팅 연결 등의 복구 로직이 필요함
    console.log(`현재 상태: ${myStatus.value}, 방 ID: ${myRecruitId.value}`)
})

// Main.vue 페이지를 나가면 
onUnmounted(() => {

    // 소켓 통신 종료
    if (ws) {
        ws.close()
    }
})

// ===================================================
// ============= RecruitListItem.vue ================
// ===================================================

// --- 모집 리스트 로드 함수 (JSON 파일 받아오기) ---
const fetchRecruits = async () => {
    try {
        const res = await api.getRecruitList()

        // 데이터가 정상이라면
        if (res && res.data) {
            recruitList.value = res.data
            // 데이터에 문제가 있으면
        } else {
            console.warn("데이터 형식이 올바르지 않거나 비어있습니다.")
        }
    } catch (error) {
        console.log("fetchRecruits 에러 : ", error)
    }
    // --- 기존 함수 로직 ---
    // recruitList.value = [
    //     { id: 1, start: '강남역 2번 출구', startLat: 37.498095, startLng: 127.027610, dest: '판교역', time: '10분 후', cur: 1, max: 4, tags: ['#비흡연', '#조용히'], desc: '칼퇴하고 가실 분 구합니다.' },
    //     { id: 2, start: '합정역', startLat: 37.548925, startLng: 126.913501, dest: '일산 호수공원', time: '지금 바로', cur: 3, max: 4, tags: ['#짐있음'], desc: '트렁크 자리 좀 필요해요.' }
    // ]
}

// ===================================================
// ============ RecruitDetailPanel.vue ===============
// ===================================================

// --- 패널 열기 로직 ---
const handleSelectRecruit = (recruit) => {
    if (isDetailOpen.value && selectedRecruit.value?.id === recruit.id) {
        isDetailOpen.value = false
        selectedRecruit.value = null
    } else {
        selectedRecruit.value = recruit
        isDetailOpen.value = true

        // 지도를 해당 모집글의 출발지 좌표를 이동시키기
        if (mapComponent.value && recruit.startLat && recruit.startLng) {
            mapComponent.value.moveToLocation(recruit.startLat, recruit.startLng)
        }
    }
}

// --- 채팅방 참여하기 로직 (내가 참여자) ---
const joinChat = () => {
    if (!selectedRecruit.value) {
        return
    }

    // 이미 모집 중이거나 참여 중이면 거절
    if (myStatus.value !== 'IDLE') {
        // 만약 내가 들어간 방이면 채팅방으로 이동
        if (myRecruitId.value === selectedRecruit.value.id) {
            router.push(`/chat/${selectedRecruit.value.id}`)
            return
        }
        alert('이미 참여 중인 다른 모집이 있습니다.')
        return
    }

    // 참여자로 상태 변경
    updateMyStatus('JOINED', selectedRecruit.value.id)

    // 채팅방 이동
    router.push(`/chat/${selectedRecruit.value.id}`)
}

// --- [UI 개선] 하단 버튼 텍스트/상태 ---
const actionButtonState = computed(() => {
    if (myStatus.value === 'OWNER') {
        return { text: '모집 중...', disabled: true }
    } else if (myStatus.value === 'JOINED') {
        return { text: '참여 중...', disabled: true }
    } else {
        return { text: '모집 시작', disabled: false }
    }
})

// --- 상태 업데이트 및 LocalStorage 저장 함수 ---
const updateMyStatus = (status, id) => {
    myStatus.value = status
    myRecruitId.value = id

    if (status === 'IDLE') {
        localStorage.removeItem('myStatus')
        localStorage.removeItem('myRecruitId')
    } else {
        localStorage.setItem('myStatus', status)
        localStorage.setItem('myRecruitId', String(id))
    }
}

// ===================================================
// ============= BottonAcationBar.vue ================
// ===================================================

// --- 모집 시작하기 부분 반응형 동작 함수 ---
const bottomBarClass = computed(() => {
    return isDetailOpen.value
        ? 'left-4 md:left-[920px]'  // 상세 패널이 열렸을 때 (오른쪽으로 밀림)
        : 'left-4 md:left-[500px]'  // 닫혔을 때 (기본 위치)
})

// ===================================================
// ============= CreateRecruitModal.vue ==============
// ===================================================

// --- 모집 시작하기 로직 (내가 방장되기) ---
const handleCreateSubmit = (formData) => {

    // 이미 다른 방에 참여 중이면 거절
    if (myStatus.value !== 'IDLE') {
        alert('이미 진행 중인 모집이 있습니다.')
        return
    }

    const payload = {
        type: 'createRecruit', payload: formData
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload))

        // 모집장
        // 실제로는 서버 DB ID를 받아야 하지만 임시로 타임스팸트
        const newId = Date.now()

        // 리스트에 즉시 반영
        recruitList.value.unshift({
            id: newId, // 생성해둔 ID 사용 (일치 보장)
            ...payload.payload,
            cur: 1
        })

        // 상태 저장
        updateMyStatus('OWNER', newId)

        isCreateModalOpen.value = false
        alert('모집이 시작되었습니다!')

        // 바로 채팅방 이동 (예시)
        // router.push(`/chat/${newId}`)
    } else {
        alert('서버 연결 상태를 확인해주세요.')
    }
}


// --- 지도에서 위치 업데이트 신호를 받으면 실행 ---
const handleLocationUpdate = (coords) => {
    myLat.value = coords.lat
    myLng.value = coords.lng
}

// --- 소켓 로직 ---
const connectWebSocket = () => {
    const wsUrl = `ws://127.0.0.1:8080/ws/chat?userId=${encodeURIComponent(authStore.user.id)}`
    ws = new WebSocket(wsUrl)
    ws.onopen = () => {
        // 소켓 연결 확인용
        console.log("Socket Connected");
        isSocketConnected.value = true
    }
    ws.onclose = () => {
        // 소켓 연결 끊어짐 확인용
        console.log("Socket disConnected")
        isSocketConnected.value = false
    }
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            // 모집한 글이 서버에 등록 완료됐다는 신호를 받으면 리스트에 추가
            if (data.type === 'newRecruit') {
                recruitList.value.unshift(data.recruit)
            } else if (data.type === 'updateRecruit') {
                const idx = recruitList.value.findIndex(r => r.id === data.recruit.id)
                if (idx !== -1) {
                    recruitList.value[idx] = data.recruit
                }
            }
        } catch (e) {

        }
    }
}

// --- 지도 컨트롤 (자식 컴포넌트 함수 호출) ---
// mapComponent.value가 TheMap 컴포넌트 자체를 가리킵니다.
const zoomIn = () => mapComponent.value?.zoomIn()
const zoomOut = () => mapComponent.value?.zoomOut()
const moveToCurrentLocation = () => mapComponent.value?.panToCurrent()

// 지도에서 보이는 ID 목록을 업데이트 하는 함수
const handleVisibleListUpdate = (ids) => {
    visibleRecruitIds.value = ids
}

// 실제로 리스트 패널에 보여줄 데이터
// 전체 리스트 중에서 visbleRecruitIds에 포함된 것만 필터링
const displayRecruitList = computed(() => {
    // 만약 지도가 아직 로드가 안 됐거나 ID 목록이 비어있으면
    if (visibleRecruitIds.value.length === 0) {
        return []
    }

    return recruitList.value.filter(item => visibleRecruitIds.value.includes(item.id))
})

// [추가] 지도 중심 오프셋 계산 (Computed)
const mapCenterOffset = computed(() => {
    // 모바일(768px 미만)에서는 오프셋 없음 (화면 전체 사용하거나 바텀시트라서)
    if (window.innerWidth < 768) return 0

    // 상세 패널 열림: 왼쪽 880px 가량 가려짐 -> 440px 이동
    if (isDetailOpen.value) return 440

    // 기본 상태: 왼쪽 460px 가량 가려짐 -> 230px 이동
    return 230
})
</script>

<template>
    <div class="relative w-full h-full">
        <Map ref="mapComponent" :recruit-list="recruitList" :center-offset="mapCenterOffset"
            @update-location="handleLocationUpdate" @marker-click="handleSelectRecruit"
            @update-visible-list="handleVisibleListUpdate" />

        <div class="absolute inset-0 z-10 flex p-4 pointer-events-none">
            <div class="hidden md:block w-20 shrink-0 mr-4"></div>
            <RecruitListPanel :recruit-list="displayRecruitList" :is-open="true" :selected-id="selectedRecruit?.id"
                :is-socket-connected="isSocketConnected" @expand="isPanelOpen = true" @select="handleSelectRecruit" />

            <RecruitDetailPanel :recruit="selectedRecruit" :is-open="isDetailOpen" :my-status="myStatus"
                :my-recruit-id="myRecruitId" @close="isDetailOpen = false" @join="joinChat" />
        </div>

        <MapControls :nickname="authStore.user?.username" @zoom-in="zoomIn" @zoom-out="zoomOut"
            @move-location="moveToCurrentLocation" />

        <BottomActionBar :class="bottomBarClass" :route-info="displayRoute" :button-state="actionButtonState"
            @open-create="isCreateModalOpen = true" />

        <CreateRecruitModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false"
            @submit="handleCreateSubmit" />
    </div>
</template>