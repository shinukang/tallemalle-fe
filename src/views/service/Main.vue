<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 컴포넌트 import
import Map from '@/components/main/Map.vue' // [추가됨]
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
const selectedRecruit = ref(null)
const isDetailOpen = ref(false)
const isCreateModalOpen = ref(false)

let ws = null

// --- 초기화 ---
onMounted(() => {
    if (!authStore.user) { router.push('/login'); return }
    connectWebSocket()
    fetchRecruits()
})

onUnmounted(() => { if (ws) ws.close() })

// --- 지도에서 위치 업데이트 신호를 받으면 실행 ---
const handleLocationUpdate = (coords) => {
    myLat.value = coords.lat
    myLng.value = coords.lng
}

// --- 소켓 로직 ---
const connectWebSocket = () => {
    const wsUrl = `ws://127.0.0.1:8080/ws?userId=${encodeURIComponent(authStore.user.id)}`
    ws = new WebSocket(wsUrl)
    ws.onopen = () => isSocketConnected.value = true
    ws.onclose = () => isSocketConnected.value = false
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.type === 'newRecruit') recruitList.value.unshift(data.recruit)
            else if (data.type === 'updateRecruit') {
                const idx = recruitList.value.findIndex(r => r.id === data.recruit.id)
                if (idx !== -1) recruitList.value[idx] = data.recruit
            }
        } catch (e) { }
    }
}

const fetchRecruits = () => {
    recruitList.value = [
        { id: 1, start: '강남역 2번 출구', dest: '판교역', time: '10분 후', cur: 1, max: 4, tags: ['#비흡연', '#조용히'], desc: '칼퇴하고 가실 분 구합니다.' },
        { id: 2, start: '합정역', dest: '일산 호수공원', time: '지금 바로', cur: 3, max: 4, tags: ['#짐있음'], desc: '트렁크 자리 좀 필요해요.' }
    ]
}

const handleSelectRecruit = (recruit) => {
    if (isDetailOpen.value && selectedRecruit.value?.id === recruit.id) {
        isDetailOpen.value = false
        selectedRecruit.value = null
    } else {
        selectedRecruit.value = recruit
        isDetailOpen.value = true
    }
}

const bottomBarClass = computed(() => {
    return isDetailOpen.value
        ? 'left-4 md:left-[860px]'  // 상세 패널이 열렸을 때 (오른쪽으로 밀림)
        : 'left-4 md:left-[440px]'  // 닫혔을 때 (기본 위치)
})

const handleCreateSubmit = (formData) => {
    const payload = { type: 'createRecruit', payload: formData }
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload))
        recruitList.value.unshift({ id: Date.now(), ...payload.payload, cur: 1 })
        isCreateModalOpen.value = false
        alert('모집이 시작되었습니다!')
    } else {
        alert('서버 연결 상태를 확인해주세요.')
    }
}

const joinChat = () => router.push('/chat')

// --- 지도 컨트롤 (자식 컴포넌트 함수 호출) ---
// mapComponent.value가 TheMap 컴포넌트 자체를 가리킵니다.
const zoomIn = () => mapComponent.value?.zoomIn()
const zoomOut = () => mapComponent.value?.zoomOut()
const moveToCurrentLocation = () => mapComponent.value?.panToCurrent()

</script>

<template>
    <div class="relative w-full h-full">

        <Map ref="mapComponent" @update-location="handleLocationUpdate" />

        <div class="absolute inset-0 z-10 flex p-4 pointer-events-none">

            <div class="hidden md:block w-20 shrink-0 mr-4"></div>

            <RecruitListPanel :recruit-list="recruitList" :is-open="true" :selected-id="selectedRecruit?.id"
                :is-socket-connected="isSocketConnected" @expand="isPanelOpen = true" @select="handleSelectRecruit" />

            <RecruitDetailPanel :recruit="selectedRecruit" :is-open="isDetailOpen" @close="isDetailOpen = false"
                @join="joinChat" />

        </div>
        <MapControls :nickname="authStore.user?.nickname" @zoom-in="zoomIn" @zoom-out="zoomOut"
            @move-location="moveToCurrentLocation" />

        <BottomActionBar :class="bottomBarClass" :route-info="displayRoute" @open-create="isCreateModalOpen = true" />

        <CreateRecruitModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false"
            @submit="handleCreateSubmit" />
    </div>
</template>