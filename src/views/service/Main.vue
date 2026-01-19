<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS (라이브러리 -> 스토어/API/Composable -> 컴포넌트)
 * ==============================================================================
 */
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Stores & Composables
import { useAuthStore } from '@/stores/auth'
import { useRecruitStore } from '@/stores/recruit'
import { useWebSocket } from '@/composables/useWebSocket'
import api from '@/api/main/index.js'

// Components
import Map from '@/components/main/Map.vue'
import RecruitListPanel from '@/components/main/RecruitListPanel.vue'
import RecruitDetailPanel from '@/components/main/RecruitDetailPanel.vue'
import CreateRecruitModal from '@/components/main/CreateRecruitModal.vue'
import MapControls from '@/components/main/MapControls.vue'
import BottomActionBar from '@/components/main/BottomActionBar.vue'

/**
 * ==============================================================================
 * 2. CONFIG & STORES (설정 및 스토어 초기화)
 * ==============================================================================
 */
const router = useRouter()
const authStore = useAuthStore()
const recruitStore = useRecruitStore()

// 반응형 상태 구조분해 (Pinia)
// status: 'IDLE'(기본), 'OWNER'(모집장), 'JOINED'(참여자)
const { status: myStatus, recruitId: myRecruitId } = storeToRefs(recruitStore)

// WebSocket 연결 (Composable 사용)
const { isConnected, connect, sendMessage } = useWebSocket()

/**
 * ==============================================================================
 * 3. STATE & REFS (상태 변수 선언)
 * ==============================================================================
 */
// 지도 관련
const mapComponent = ref(null) // 자식 컴포넌트(TheMap) 접근용
const myLat = ref(37.498095)
const myLng = ref(127.02761)

// 데이터 관련
const recruitList = ref([])
const visibleRecruitIds = ref([])
const selectedRecruit = ref(null)
const displayRoute = ref('경로 미지정')

// UI 상태 (모달, 패널 등)
const isPanelOpen = ref(false)
const isDetailOpen = ref(false)
const isCreateModalOpen = ref(false)
const isLoading = ref(false)
const isError = ref(false)

/**
 * ==============================================================================
 * 4. COMPUTED (계산된 속성)
 * ==============================================================================
 */
// 하단 버튼 텍스트 및 상태 계산
const actionButtonState = computed(() => {
    if (myStatus.value === 'OWNER') {
        return { text: '모집 중...', disabled: true }
    } else if (myStatus.value === 'JOINED') {
        return { text: '참여 중...', disabled: true }
    } else {
        return { text: '모집 시작', disabled: false }
    }
})

// 패널 열림 여부에 따른 하단 바 위치 조정
const bottomBarClass = computed(() => {
    return isDetailOpen.value
        ? 'left-4 md:left-[920px]'  // 상세 패널 열림 (오른쪽 밀림)
        : 'left-4 md:left-[500px]'  // 닫힘 (기본 위치)
})

// 지도에 보이는 영역만 리스트에 표시
const displayRecruitList = computed(() => {
    if (visibleRecruitIds.value.length === 0) return []
    return recruitList.value.filter(item => visibleRecruitIds.value.includes(item.id))
})

// 상세 패널 오픈 시 지도 중심 이동 오프셋
const mapCenterOffset = computed(() => {
    if (window.innerWidth < 768) return 0 // 모바일은 오프셋 없음
    if (isDetailOpen.value) return 440 // 상세 열림
    return 230 // 기본 (리스트 패널만 열림)
})

/**
 * ==============================================================================
 * 5. LIFECYCLE (생명주기 훅)
 * ==============================================================================
 */
onMounted(async () => {
    // 1. 비로그인 접근 차단
    if (!authStore.user) {
        router.push('/login')
        return
    }

    // 2. 소켓 연결 시작 (방어 코드 적용된 핸들러 전달)
    const wsUrl = `ws://127.0.0.1:8080/ws/chat?userId=${encodeURIComponent(authStore.user.id)}`
    connect(wsUrl, handleSocketMessage)

    // 3. 초기 데이터 로드
    await fetchRecruits()

    // 4. 상태 복구/검증 로직
    if (myStatus.value !== 'IDLE' && myRecruitId.value) {
        const targetRoom = recruitList.value.find(r => r.id === myRecruitId.value)
        if (!targetRoom) {
            // (TODO: 실제로는 상태 검증 API 호출 필요)
            // 임시: 방이 없으면 상태 초기화
            // alert("참여 중이던 방이 종료되었습니다.")
            // updateMyStatus('IDLE', null)
        }
    }
    console.log(`현재 상태: ${myStatus.value}, 방 ID: ${myRecruitId.value}`)
})

/**
 * ==============================================================================
 * 6. METHODS - DATA & NETWORK (데이터 통신 및 소켓)
 * ==============================================================================
 */
// 모집 리스트 조회 (API)
const fetchRecruits = async () => {
    isLoading.value = true
    isError.value = false
    try {
        const res = await api.getRecruitList()
        if (res && Array.isArray(res.data)) {
            recruitList.value = res.data.filter(item => item.startLat && item.startLng)
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
}

// WebSocket 메시지 수신 핸들러 (방어 코드 적용됨)
const handleSocketMessage = (event) => {
    if (!event.data) return

    try {
        const data = JSON.parse(event.data)
        if (!data || typeof data !== 'object') return

        console.log("📩 받은 메시지 : ", data)

        // 1. 신규 모집글 등록 알림
        if (data.type === 'newRecruit' && data.payload) {
            recruitList.value.unshift(data.payload)
        }
        // 2. 모집글 수정 알림
        else if (data.type === 'updateRecruit') {
            const targetRecruit = data.payload || data.recruit
            if (targetRecruit && targetRecruit.id) {
                const idx = recruitList.value.findIndex(r => r.id === targetRecruit.id)
                if (idx !== -1) {
                    recruitList.value[idx] = targetRecruit
                }
            }
        }
    } catch (e) {
        console.error("🚨 이상한 데이터 수신:", event.data)
    }
}

// 모집 시작하기 (방장 되기)
const handleCreateSubmit = (formData) => {
    if (myStatus.value !== 'IDLE') {
        alert('이미 진행 중인 모집이 있습니다.')
        return
    }
    if (!isConnected.value) {
        alert("서버와 연결이 불안정합니다. 잠시 후 다시 시도해주세요.")
        return
    }
    if (!formData.startLat || !formData.startLng) {
        alert("출발지와 목적지의 위치 정보가 정확하지 않습니다.")
        return
    }

    const newId = Date.now()
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
        sendMessage(payload)

        // 성공 처리
        recruitStore.setOwner(newId)
        isCreateModalOpen.value = false
        alert('모집이 시작되었습니다!')
        // router.push(`/chat/${newId}`) 
    } catch (e) {
        console.error("전송 실패:", e)
        alert('전송 중 오류가 발생했습니다.')
    }
}

/**
 * ==============================================================================
 * 7. METHODS - UI INTERACTION (화면 조작)
 * ==============================================================================
 */
// 리스트 아이템 클릭 (상세 패널 열기)
const handleSelectRecruit = (recruit) => {
    if (isDetailOpen.value && selectedRecruit.value?.id === recruit.id) {
        isDetailOpen.value = false
        selectedRecruit.value = null
    } else {
        selectedRecruit.value = recruit
        isDetailOpen.value = true
        // 지도 이동
        if (mapComponent.value && recruit.startLat) {
            mapComponent.value.moveToLocation(recruit.startLat, recruit.startLng)
        }
    }
}

// 채팅방 참여하기 (참여자 되기)
const joinChat = () => {
    if (!selectedRecruit.value) return

    if (myStatus.value !== 'IDLE') {
        if (myRecruitId.value === selectedRecruit.value.id) {
            router.push("/chat")
            return
        }
        alert('이미 참여 중인 다른 모집이 있습니다.')
        return
    }

    recruitStore.setJoined(selectedRecruit.value.id)
    router.push('/chat')
}

// 지도 관련 핸들러
const handleLocationUpdate = (coords) => {
    myLat.value = coords.lat
    myLng.value = coords.lng
}

const handleVisibleListUpdate = (ids) => {
    visibleRecruitIds.value = ids
}

// 지도 컨트롤 프록시 함수
const zoomIn = () => mapComponent.value?.zoomIn()
const zoomOut = () => mapComponent.value?.zoomOut()
const moveToCurrentLocation = () => mapComponent.value?.panToCurrent()

</script>

<template>
    <div class="relative w-full h-full">
        <Map ref="mapComponent" :recruit-list="recruitList" :center-offset="mapCenterOffset"
            @update-location="handleLocationUpdate" @marker-click="handleSelectRecruit"
            @update-visible-list="handleVisibleListUpdate" />

        <div class="absolute inset-0 z-10 flex p-4 pointer-events-none">
            <div class="hidden md:block w-20 shrink-0 mr-4"></div>
            <RecruitListPanel :recruit-list="displayRecruitList" :is-open="true" :selected-id="selectedRecruit?.id"
                :is-socket-connected="isConnected" @expand="isPanelOpen = true" @select="handleSelectRecruit" />

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