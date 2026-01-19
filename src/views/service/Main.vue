<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRecruitStore } from '@/stores/recruit'
import { storeToRefs } from 'pinia'
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
const recruitStore = useRecruitStore()

// --- 사용자 상태 관리 (LocalStorage 연동) ---
// status: 'IDLE'(기본), 'OWNER'(모집장), 'JOINED'(참여자)
const { status: myStatus, recruitId: myRecruitId } = storeToRefs(recruitStore)

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



// 웹 소켓 변수
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

    // 이미 참여중인 방 ID가 있는데, 현재 리스트에 그 방이 없다면?
    if (myStatus.value !== 'IDLE' && myRecruitId.value) {
        const targetRoom = recruitList.value.find(r => r.id === myRecruitId.value)
        if (!targetRoom) {
            // 리스트에 없다고 무조건 지우지 말고 상세 조회를 시도했을 때 404가 뜨면 초기화 해야함
            try {
                // 여긴 상태 검증 api가 들어가야 함
            } catch (e) {
                alert("참여 중이던 방이 종료되었습니다.")
                updateMyStatus('IDLE', null)
            }
        }
    }
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

// 상태 변수
const isLoading = ref(false)
const isError = ref(false)

// --- 모집 리스트 로드 함수 (JSON 파일 받아오기) ---
const fetchRecruits = async () => {

    isLoading.value = true
    isError.value = false

    // === API 데이터 로딩 실패 및 빈 데이터 처리 ===
    // === 상황:      서버가 꺼져있거나 네트워크 문제로 api.getRecruitList()가 실패할 경우, 사용자는 하얀 화면이나 무한 로딩을 보게 됩니다. ===
    // === 해결 방법: try-catch를 보강하고, 에러 발생 시 사용자에게 알림을 주거나 '재시도 버튼'을 노출해야 합니다. ===
    try {
        const res = await api.getRecruitList()

        // 데이터가 정상이라면
        if (res && Array.isArray(res.data)) {
            recruitList.value = res.data.filter(item => item.startLat && item.startLng)
            // 데이터에 문제가 있으면
        } else {
            recruitList.value = []
        }
    } catch (error) {
        console.log("fetchRecruits 에러 : ", error)
        isError.value = true
        alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
        isLoading.value = false
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
            // 프론트 프로젝트에서는 그냥 chat으로 가게 변경
            // router.push(`/chat/${selectedRecruit.value.id}`)
            router.push("/chat")
            return
        }
        alert('이미 참여 중인 다른 모집이 있습니다.')
        return
    }

    // 참여자로 상태 변경
    recruitStore.setJoined(selectedRecruit.value.id)

    // 채팅방 이동
    // router.push(`/chat/${selectedRecruit.value.id}`)
    // 마찬가지로 프론트 프로젝트에서는 그냥 chat으로 가게 변경
    router.push('/chat')
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
// === 상황:      소켓이 연결되지 않은 상태(isSocketConnected = false)에서 '모집 시작하기'를 누르면, ws.send에서 에러가 나거나 아무 반응이 없습니다. ===
// === 해결 방법: 버튼을 비활성화하거나, 전송 직전에 연결 상태를 한 번 더 체크해야 합니다. ===
const handleCreateSubmit = (formData) => {

    // 이미 다른 방에 참여 중이면 거절
    if (myStatus.value !== 'IDLE') {
        alert('이미 진행 중인 모집이 있습니다.')
        return
    }

    // 소켓 연결 상태 체크
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert("서버와 연결이 불안정합니다. 잠시 후 다시 시도해주세요.")
        return
    }

    // 데이터 유효성 재검증(좌표 확인)
    if (!formData.startLat || !formData.startLng) {
        alert("출발지와 목적지의 위치 정보가 정확하지 않습니다.")
        return
    }

    // ID 미리 생성
    const newId = Date.now()

    // 서버로 보낼 데이터 포장
    const payload = {
        type: 'createRecruit',
        payload: {
            id: newId,
            ...formData,
            cur: 1,
            max: formData.max || 4
        }
    }

    try {
        // 서버로 데이터 전송
        ws.send(JSON.stringify(payload))

        // 내 상태 변경
        recruitStore.setOwner(newId)

        // 모달 닫기 및 알림
        isCreateModalOpen.value = false
        alert('모집이 시작되었습니다!')

        // 바로 채팅방 이동 (예시)
        // router.push(`/chat/${newId}`)
    } catch (e) {
        console.error("전송 실패:", e)
        alert('서버 연결 상태를 확인해주세요.')
    }
}


// --- 지도에서 위치 업데이트 신호를 받으면 실행 ---
const handleLocationUpdate = (coords) => {
    myLat.value = coords.lat
    myLng.value = coords.lng
}


// ===================================================
// ==================== WebSocket ====================
// ===================================================

let reconnectInterval = null

// === 상황 :     사용자가 이동 중에 인터넷이 잠깐 끊기거나, 서버가 재배포되어 소켓 연결이 끊어질 수 있습니다. 현재 코드는 onclose 로그만 찍고 끝납니다. ===
// === 해결 방법: 연결이 끊어지면 3초 뒤에 자동으로 재연결을 시도하는 로직(Reconnect)이 필요합니다. ===
const connectWebSocket = () => {
    // 이미 연결되어 있으면 리턴
    if (ws && ws.readyState === WebSocket.OPEN) {
        return
    }

    const wsUrl = `ws://127.0.0.1:8080/ws/chat?userId=${encodeURIComponent(authStore.user.id)}`
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        // 소켓 연결 확인용
        console.log("Socket Connected");
        isSocketConnected.value = true

        // 재연결 시도 중이었다면 중단
        if (reconnectInterval) {
            clearInterval(reconnectInterval)
            reconnectInterval = null
        }
    }

    ws.onclose = () => {
        // 소켓 연결 끊어짐 확인용
        console.log("Socket disConnected")
        isSocketConnected.value = false

        // 연결이 끊어지면 3초마다 재연결 시도
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                console.log("Socket reConnected try...")
                connectWebSocket()
            }, 3000)
        }
    }

    ws.onerror = (error) => {
        console.error("Socket Error : ", error)
        ws.close()
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            // 1. 모집한 글이 서버에 등록 완료됐다는 신호를 받았을 때
            if (data.type === 'newRecruit') {
                // 백엔드에서 payload라는 이름으로 보내서 payload로 받기
                recruitList.value.unshift(data.payload)
            }
            // 2. 글 수정 신호를 받았을 때
            else if (data.type === 'updateRecruit') {
                const targetRecruit = data.payload || data.recruit

                const idx = recruitList.value.findIndex(r => r.id === data.recruit.id)
                if (idx !== -1) {
                    recruitList.value[idx] = targetRecruit
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

        <MapControls :nickname="authStore.user?.userName" @zoom-in="zoomIn" @zoom-out="zoomOut"
            @move-location="moveToCurrentLocation" />

        <BottomActionBar :class="bottomBarClass" :route-info="displayRoute" :button-state="actionButtonState"
            @open-create="isCreateModalOpen = true" />

        <CreateRecruitModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false"
            @submit="handleCreateSubmit" />
    </div>
</template>