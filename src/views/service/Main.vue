<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
    Plus, Minus, LocateFixed, Navigation2, Rocket, ListFilter, MapPin,
    Navigation, X, ChevronDown, Minus as IconMinus, Plus as IconPlus
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// --- 지도 및 위치 상태 ---
const mapContainer = ref(null)
const mapInstance = ref(null)
const myMarker = ref(null) // 내 위치 마커 객체를 저장할 변수
const myLat = ref(37.498095)
const myLng = ref(127.02761)

// --- UI 상태 ---
const isPanelOpen = ref(false)
const startInput = ref('')
const destInput = ref('')
const displayRoute = ref('경로 미지정')

// --- 모집 데이터 및 모달 상태 ---
const recruitList = ref([]) // 모집 리스트
const selectedRecruit = ref(null) // 현재 선택된 모집글 (상세보기용)
const isDetailOpen = ref(false) // 상세 패널 열림 여부
const isCreateModalOpen = ref(false) // 모집하기 모달 열림 여부

// 모집 생성 폼 데이터
const createForm = ref({
    start: '',
    dest: '',
    time: 'Now',
    maxMember: 4,
    tags: '',
    desc: ''
})

// WebSocket 객체
let ws = null

// Websocket 반응형 변수 설정
const isSocketConnected = ref(false)

// --- 초기화 (지도 & 소켓) ---
onMounted(() => {
    if (!authStore.user) {
        router.push('/login')
        return
    }

    // 1. 카카오 지도 로드
    if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(myLat.value, myLng.value),
                level: 3
            }
            mapInstance.value = new window.kakao.maps.Map(mapContainer.value, options)

            // 내 위치 추적 시작
            initGeolocation()
        })
    }

    // 2. 웹소켓 연결 (실시간 모집 정보 수신)
    connectWebSocket()

    // (임시) 초기 데이터 페칭 시뮬레이션
    fetchRecruits()
})

onUnmounted(() => {
    if (ws) ws.close()
})

// --- [핵심] 내 위치 실시간 추적 ---
const initGeolocation = () => {
    if (navigator.geolocation) {
        // watchPosition: 위치가 변할 때마다 실행됨
        navigator.geolocation.watchPosition((pos) => {
            myLat.value = pos.coords.latitude
            myLng.value = pos.coords.longitude

            // 위치가 갱신될 때마다 마커 이동시키기
            updateMyMarker()
        }, (err) => {
            console.error('위치 정보를 가져올 수 없습니다.', err)
        }, {
            enableHighAccuracy: true // 배터리를 더 쓰더라도 정확도 높임
        })
    }
}

// --- [핵심] 마커를 생성하거나 이동시키는 함수 ---
const updateMyMarker = () => {
    if (!mapInstance.value || !window.kakao) return

    const loc = new window.kakao.maps.LatLng(myLat.value, myLng.value)

    // 마커가 아직 없으면 -> 새로 만듦 (CustomOverlay로 예쁘게)
    if (!myMarker.value) {
        const content = '<div class="w-6 h-6 bg-indigo-600 rounded-full border-[3px] border-white shadow-lg pulse-animation"></div>'

        myMarker.value = new window.kakao.maps.CustomOverlay({
            map: mapInstance.value,
            position: loc,
            content: content,
            yAnchor: 0.5,
            zIndex: 100
        })

        // 처음에만 지도를 내 위치로 이동
        mapInstance.value.panTo(loc)
    } else {
        // 마커가 이미 있으면 -> 위치만 쓱 옮김 (부드럽게)
        myMarker.value.setPosition(loc)
    }
}

// --- WebSocket 로직 ---
const connectWebSocket = () => {
    // 실제 서버 주소로 변경 필요
    const wsUrl = `ws://127.0.0.1:8080/ws/chat`
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        console.log('WebSocket Connected')
        isSocketConnected.value = true

    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.type === 'newRecruit') {
                recruitList.value.unshift(data.recruit)
            } else if (data.type === 'updateRecruit') {
                const idx = recruitList.value.findIndex(r => r.id === data.recruit.id)
                if (idx !== -1) recruitList.value[idx] = data.recruit
            }
        } catch (e) {
            console.error(e)
        }
    }
}

// (임시) 데이터 로드 함수 (API 대용)
const fetchRecruits = () => {
    recruitList.value = [
        { id: 1, start: '강남역 2번 출구', dest: '판교역', time: '10분 후', cur: 1, max: 4, tags: ['#비흡연', '#조용히'], desc: '칼퇴하고 가실 분 구합니다.' },
        { id: 2, start: '합정역', dest: '일산 호수공원', time: '지금 바로', cur: 3, max: 4, tags: ['#짐있음'], desc: '트렁크 자리 좀 필요해요.' }
    ]
}

// --- 기능 메소드 ---

// 1. 모집 리스트 필터링
const filteredList = computed(() => {
    return recruitList.value.filter(item => {
        const s = startInput.value.trim()
        const d = destInput.value.trim()
        return (!s || item.start.includes(s)) && (!d || item.dest.includes(d))
    })
})

// 2. 패널 제어
const expandPanel = () => { isPanelOpen.value = true }
const collapsePanel = () => { isPanelOpen.value = false }

// 3. 상세 정보 보기 (List Item Click)
const openDetail = (recruit) => {

    // 1. 현재 패널이 열려있고(isDetailOpen.value), 
    // 2. 클릭한 아이템의 ID가 현재 보고 있는 아이템의 ID와 같다면
    if (isDetailOpen.value && selectedRecruit.value?.id === recruit.id) {
        closeDetail()
    } else {
        // 그게 아니라면 (닫혀있거나, 다른 아이템을 클릭했다면) 정보를 갱신하고 엽니다.
        selectedRecruit.value = recruit
        isDetailOpen.value = true
    }
}

const closeDetail = () => {
    isDetailOpen.value = false
    selectedRecruit.value = null
}

// 4. 모집하기 모달 제어
const openCreateModal = () => {
    createForm.value = { start: '', dest: '', time: 'Now', maxMember: 4, tags: '', desc: '' }
    isCreateModalOpen.value = true
}

const closeCreateModal = () => {
    isCreateModalOpen.value = false
}

// 5. 모집 생성 요청 (Create)
const handleCreateRecruit = () => {
    const { start, dest, time, maxMember, tags, desc } = createForm.value

    if (!start || !dest) {
        alert('출발지와 목적지를 입력해주세요.')
        return
    }

    const payload = {
        type: 'createRecruit',
        payload: {
            start, dest, time, desc,
            tags: tags.split(' ').map(t => t.startsWith('#') ? t : `#${t}`),
            max: maxMember
        }
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload))
        recruitList.value.unshift({
            id: Date.now(), ...payload.payload, cur: 1
        })
        closeCreateModal()
        alert('모집이 시작되었습니다!')
    } else {
        alert('서버 연결 상태를 확인해주세요.')
    }
}

// 6. 채팅방 입장 (Join)
const joinRecruit = () => {
    if (!selectedRecruit.value) return

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'joinRecruit',
            recruitId: selectedRecruit.value.id
        }))
        router.push('/chat')
    } else {
        router.push('/chat')
    }
}

// 7. 인원수 조절
const updateMemberCount = (delta) => {
    let newCount = createForm.value.maxMember + delta
    if (newCount < 2) newCount = 2
    if (newCount > 10) newCount = 10
    createForm.value.maxMember = newCount
}

// 8. 지도 컨트롤
const zoomIn = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() - 1)
const zoomOut = () => mapInstance.value?.setLevel(mapInstance.value.getLevel() + 1)
// 내 위치로 지도 중심 이동 함수
const movetoCurrentLocaton = () => {
    // 지도가 로드되었고, 내 위치 좌표가 있을 때만 실행
    if (mapInstance.value && myLat.value && myLng.value) {
        const loc = new window.kakao.maps.LatLng(myLat.value, myLng.value)
        mapInstance.value.panTo(loc);
    } else {
        alert("지도가 로딩 중이거나 위치 정보를 가져올 수 없습니다.")
    }
}
</script>

<template>
    <div class="relative w-full h-full">
        <div ref="mapContainer" class="absolute inset-0 w-full h-full z-0"></div>

        <div class="absolute inset-0 z-10 flex p-4 pointer-events-none">
            <div class="hidden md:block w-20 shrink-0 mr-4"></div>

            <div class="glass-panel w-full md:w-[380px] h-full rounded-[2.5rem] flex flex-col overflow-hidden pointer-events-auto bg-white/90 backdrop-blur-md border border-white/50 shadow-xl transition-transform duration-300"
                :class="{ 'translate-y-0': isPanelOpen, 'translate-y-[calc(100%-150px)] md:translate-y-0': !isPanelOpen }">
                <div class="p-6 md:p-8 border-b border-slate-100 shrink-0">
                    <h1 class="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex justify-between items-center">
                        탈래말래
                        <span v-if="isSocketConnected"
                            class="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">Online</span>
                        <span v-else
                            class="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Offline</span>
                    </h1>
                    <div class="space-y-3">
                        <div class="relative group">
                            <MapPin class="absolute left-4 top-3.5 w-4 h-4 text-emerald-500" />
                            <input v-model="startInput" @focus="expandPanel" type="text" placeholder="출발지"
                                class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-indigo-100 outline-none" />
                        </div>
                        <div class="relative group">
                            <Navigation class="absolute left-4 top-3.5 w-4 h-4 text-rose-500" />
                            <input v-model="destInput" @focus="expandPanel" type="text" placeholder="목적지"
                                class="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-indigo-100 outline-none" />
                        </div>
                        <button
                            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-2">
                            <ListFilter class="w-4 h-4" />
                            조건에 맞는 모집 찾기
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
                    <h3 class="font-bold text-slate-800 text-lg px-1 mb-2">실시간 모집 ({{ filteredList.length }})</h3>

                    <div v-if="filteredList.length === 0" class="py-10 text-center text-slate-400 text-sm">
                        조건에 맞는 모집 글이 없습니다.
                    </div>

                    <div v-for="item in filteredList" :key="item.id" @click="openDetail(item)"
                        class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <div class="flex justify-between mb-2">
                            <span class="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded">{{
                                item.time }} 출발</span>
                            <span class="text-[10px] text-slate-400">{{ item.cur }}/{{ item.max }}명</span>
                        </div>
                        <p class="font-bold text-slate-800">{{ item.start }} → {{ item.dest }}</p>
                        <div class="flex gap-1 mt-2">
                            <span v-for="tag in (item.tags || [])" :key="tag"
                                class="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-panel h-full rounded-[2.5rem] flex flex-col pointer-events-auto overflow-hidden transition-all duration-300 ml-4 bg-white/90 backdrop-blur-md border border-white/50 shadow-xl"
                :class="isDetailOpen ? 'w-full md:w-[400px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 pointer-events-none'">
                <div class="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="font-bold text-slate-900 text-lg">상세 정보</h3>
                    <button @click="closeDetail" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div v-if="selectedRecruit" class="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <span
                                class="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">{{
                                    selectedRecruit.time }} 출발</span>
                            <span class="text-sm font-bold text-slate-500">
                                <span
                                    :class="selectedRecruit.cur >= selectedRecruit.max ? 'text-rose-500' : 'text-indigo-600'">{{
                                        selectedRecruit.cur }}</span> / {{ selectedRecruit.max }}명
                            </span>
                        </div>
                        <h2 class="text-2xl font-bold text-slate-900 leading-tight">{{ selectedRecruit.start }} → {{
                            selectedRecruit.dest }}</h2>
                    </div>

                    <p class="text-[14px] text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-3xl">
                        {{ selectedRecruit.desc || '별도의 설명이 없습니다.' }}
                    </p>

                    <div class="flex flex-wrap gap-2">
                        <span v-for="tag in (selectedRecruit.tags || [])" :key="tag"
                            class="text-[11px] font-bold border border-slate-100 px-4 py-2 rounded-xl bg-white shadow-sm">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <div class="p-8 bg-slate-50/50 border-t border-slate-100">
                    <button v-if="selectedRecruit && selectedRecruit.cur < selectedRecruit.max" @click="joinRecruit"
                        class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl">
                        동승 채팅방 입장
                    </button>
                    <button v-else disabled
                        class="w-full bg-slate-300 text-slate-500 font-bold py-5 rounded-2xl cursor-not-allowed">
                        모집이 마감되었습니다
                    </button>
                </div>
            </div>
        </div>

        <div class="absolute top-4 right-4 flex flex-col gap-3 pointer-events-auto z-20 items-end">
            <div
                class="bg-white/90 backdrop-blur p-2.5 rounded-2xl flex items-center gap-3 pr-5 shadow-sm border border-white/50">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {{ authStore.user?.nickname?.substring(0, 2) || 'User' }}
                </div>
                <div class="hidden md:flex flex-col">
                    <span class="text-sm font-bold text-slate-900">{{ authStore.user?.nickname || '게스트' }}</span>
                    <span class="text-[11px] text-emerald-600 font-bold">37.5°C</span>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <button @click="zoomIn"
                    class="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center hover:text-indigo-600 shadow-sm">
                    <Plus class="w-5 h-5" />
                </button>
                <button @click="zoomOut"
                    class="w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center hover:text-indigo-600 shadow-sm">
                    <Minus class="w-5 h-5" />
                </button>
                <button @click="movetoCurrentLocaton"
                    class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mt-2 shadow-lg shadow-indigo-100">
                    <LocateFixed class="w-5 h-5" />
                </button>
            </div>
        </div>

        <div class="hidden md:flex absolute bottom-8 left-[500px] right-8 z-1 justify-end pointer-events-auto">
            <div
                class="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] flex items-center justify-between gap-12 border border-white/50 shadow-xl w-full max-w-4xl">
                <div class="flex-1 flex items-center gap-10 pl-4">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">경로 정보</span>
                        <div class="flex items-center gap-2 font-bold text-slate-800">
                            <Navigation2 class="w-4 h-4 text-indigo-600" />
                            <span>{{ displayRoute }}</span>
                        </div>
                    </div>
                </div>
                <button @click="openCreateModal"
                    class="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl">
                    <span>모집 시작</span>
                    <Rocket class="w-5 h-5" />
                </button>
            </div>
        </div>

        <div v-if="isCreateModalOpen"
            class="fixed inset-0 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm z-[100]">
            <div
                class="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-slate-900">동승 모집하기</h2>
                    <button @click="closeCreateModal"
                        class="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-5">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span class="text-[10px] text-emerald-500 font-bold block mb-1">출발지</span>
                            <input v-model="createForm.start" type="text"
                                class="w-full bg-transparent font-bold text-slate-800 outline-none placeholder-slate-400"
                                placeholder="출발지 입력">
                        </div>
                        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span class="text-[10px] text-rose-500 font-bold block mb-1">목적지</span>
                            <input v-model="createForm.dest" type="text"
                                class="w-full bg-transparent font-bold text-slate-800 outline-none placeholder-slate-400"
                                placeholder="목적지 입력">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400">출발 시간</label>
                            <div class="relative">
                                <select v-model="createForm.time"
                                    class="w-full pl-4 py-4 pr-10 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none border border-slate-100">
                                    <option value="Now">지금 바로</option>
                                    <option value="10분 후">10분 후</option>
                                    <option value="20분 후">20분 후</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400">모집 인원</label>
                            <div
                                class="flex items-center justify-between w-full p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <button @click="updateMemberCount(-1)"
                                    class="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 flex items-center justify-center">
                                    <IconMinus class="w-4 h-4" />
                                </button>
                                <span class="font-bold text-slate-800">{{ createForm.maxMember }}명</span>
                                <button @click="updateMemberCount(1)"
                                    class="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 flex items-center justify-center">
                                    <IconPlus class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400">태그 (선택)</label>
                        <input v-model="createForm.tags" type="text"
                            class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none placeholder-slate-400 border border-slate-100"
                            placeholder="예: #비흡연 #여성전용">
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400">하고 싶은 말</label>
                        <textarea v-model="createForm.desc"
                            class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none resize-none h-24 border border-slate-100"
                            placeholder="예: 짐이 조금 있어요"></textarea>
                    </div>
                </div>

                <div class="p-6 border-t border-slate-100 bg-white">
                    <button @click="handleCreateRecruit"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all">
                        모집 시작하기
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>