<script setup>
/**
 * [파일 설명]
 * 이 파일은 '실시간 채팅 페이지'의 메인(부모) 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 페이지가 열리면 백엔드(또는 JSON 파일)에서 이전 대화 내역, 참여자 목록을 불러옵니다.
 * 2. WebSocket을 연결하여 실시간으로 메시지를 주고받습니다.
 * 3. 채팅 메시지 목록(messages)과 사용자 정보(usersData)를 관리하여 하위 컴포넌트에 내려줍니다.
 */

import { ref, reactive, onMounted, onUnmounted, provide } from 'vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'   // 채팅 화면 (중앙)
import RideSidebar from '@/components/chat/RideSidebar.vue' // 참여자 목록 (우측)
import ProfileModal from '@/components/chat/ProfileModal.vue' // 프로필 팝업
import { useAuthStore } from '@/stores/auth' // 로그인 정보 저장소
import { storeToRefs } from 'pinia'
import api from '@/api/chat'

// =========================================
// 1. 상태(State) 변수 선언 구역
// =========================================

/**
 * WebSocket 연결 상태
 * - isConnected: 현재 서버랑 연결됐나요? (true/false)
 * - socket: 실제 통신을 담당하는 객체
 */
const isConnected = ref(false)
let socket = null

/**
 * 내 정보 (로그인한 사용자)
 * - 초기값은 랜덤하게 만들지만, onMounted에서 실제 로그인 정보로 덮어씁니다.
 */
const myUserId = ref(`user_${Math.floor(Math.random() * 1000)}`)
const myUserName = ref('익명')
const myUserImg = ref('')

/**
 * 채팅 메시지 목록 (화면에 뿌려질 데이터)
 * - 처음엔 빈 배열([])로 시작하고, 서버에서 데이터를 받아오면 채워집니다.
 */
const messages = ref([]) 

/**
 * 로딩 상태 관리
 * - isLoading: 데이터를 불러오는 중인가요?
 * - true면 '로딩 중...' 화면을 보여주고, 다 불러오면 false로 바꿉니다.
 */
const isLoading = ref(false)

/**
 * (UPDATE) 사용자 데이터베이스
 * - 빈 객체로 시작하고 API(getChatParticipants)를 통해 채워집니다.
 */
const usersData = ref({}) 

/**
 * 프로필 모달 관련 상태
 * - isProfileModalOpen: 모달이 현재 열려있는지 여부
 * - currentProfile: 모달에 표시할 특정 유저의 상세 정보
 */
const isProfileModalOpen = ref(false)
const currentProfile = reactive({
    id: '', name: '', lv: '', img: '', meta: '', bio: '',
    score: 0, rank: '', stats: { time: 0, silent: 0 },
    reviews: [], isBlocked: false
})

/**
 * 로그인 정보 가져오기 (Pinia Store)
 * - storeToRefs를 사용해야 반응성(값이 바뀌면 화면도 바뀜)이 유지된 채로 가져올 수 있습니다.
 */
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// 여정 정보 상태 변수 추가
const rideInfo = ref(null)

// =========================================
// 2. 생명주기(Lifecycle) & 초기화 로직
// =========================================

/**
 * onMounted: 컴포넌트가 화면에 나타날 때 실행됩니다.
 * 순서: 1. 내 정보 설정 -> 2. 이전 채팅 내역 로드 -> 3. 웹소켓 연결
 */
onMounted(async () => {
  // 1. 내 정보 설정 (로그인 정보가 있으면 덮어쓰기)
  if (user.value) {
    myUserId.value = user.value.id || user.value.userId
    myUserName.value = user.value.name || user.value.nickname || user.value.userName || '익명'
    myUserImg.value = user.value.img || user.value.profileImage || user.value.userImg || ''
  } else {
    console.warn('[auth] 로그인 사용자 정보가 없습니다. localStorage USERINFO 확인 필요')
  }

  // 2. 초기 데이터 로드 (채팅 내역 + 참여자 목록)
  // 내부에서 API 함수(getChatHistory)를 호출합니다.
  await loadInitialData()

  // 3. 웹소켓 연결 시작
  connectWebSocket()
})

/**
 * onUnmounted: 화면을 벗어날 때 실행됩니다.
 * - 연결된 소켓을 끊어줘야 메모리 누수나 오류를 방지할 수 있습니다.
 */
onUnmounted(() => {
    if (socket) {
        socket.close()
    }
})

/**
 * 채팅 내역 로드 함수
 * - api/chat/index.js의 함수를 호출합니다.
 * - UI 관련 상태(isLoading, error 메시지 등)는 여전히 여기서 관리합니다.
 */
const loadInitialData = async () => {
    try {
        // 로딩 시작 (화면에 '불러오는 중...' 표시)
        isLoading.value = true
        
        // Promise.all을 사용하여 두 API를 동시에 호출합니다.
        const [historyData, participantsData, rideDetailData] = await Promise.all([
            api.getChatHistory(),       // 채팅 내역 가져오기
            api.getChatParticipants(),  // 참여자 목록 가져오기
            api.getRideDetail()         // 여정 정보 로드
        ])

        // 받아온 데이터 적용
        messages.value = historyData || []
        usersData.value = participantsData || {}
        rideInfo.value = rideDetailData || null // 데이터 저장

        // 만약 'Unknown'(알수없음) 유저가 없다면 기본값으로 추가 (안전장치)
        if (!usersData.value['Unknown']) {
            usersData.value['Unknown'] = {
                name: "알수없음", lv: "LV. 1", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown",
                meta: "정보 없음", bio: "", score: 50, rank: "-", stats: { time: 0, silent: 0 }, reviews: []
            }
        }
        
    } catch (error) {
        console.error('채팅 내역 로드 실패:', error)
        // 실패했을 때 사용자에게 보여줄 안내 메시지 (빈 화면 대신 보여줌)
        messages.value = [
            { id: 1, type: 'date', text: 'Today' },
            { id: 2, type: 'system', text: `⚠️ 데이터를 불러오는데 실패했습니다: ${error.message}` }
        ]
    } finally {
        // 성공하든 실패하든 로딩은 끝났으므로 false로 변경
        isLoading.value = false
    }
}

// =========================================
// 3. WebSocket 통신 로직
// =========================================

/**
 * 웹소켓 연결 함수
 * - 서버 주소(ws://...)로 연결을 시도하고, 각 이벤트(연결, 메시지수신, 종료, 에러)별 동작을 정의합니다.
 */
const connectWebSocket = () => {
    // 웹소켓 서버 주소
    const wsUri = "ws://localhost:8080/ws/chat"
    socket = new WebSocket(wsUri)

    // 연결 성공 시
    socket.addEventListener('open', () => {
        console.log('WEBSOCKET CONNECTED')
        isConnected.value = true
    })

    // 메시지 수신 시 (가장 중요!)
    socket.addEventListener('message', (e) => {
        try {
            // 서버에서 온 데이터(JSON 문자열)를 객체로 변환
            const parsedData = JSON.parse(e.data)
            // 데이터 구조에 따라 payload를 쓸지, 데이터 자체를 쓸지 결정
            const payload = parsedData.payload !== undefined ? parsedData.payload : parsedData
            
            // 화면에 표시하기 위한 처리 함수 호출
            handleIncomingMessage(payload)
        } catch (err) {
            // JSON이 아닌 일반 문자열이 오면 그대로 처리
            handleIncomingMessage(e.data)
        }
    })

    // 연결 종료 시
    socket.addEventListener('close', () => {
        console.log('WEBSOCKET CLOSED', {
            code: e.code,
            reason: e.reason,
            wasClean: e.wasClean
        })
        isConnected.value = false
    })

    // 에러 발생 시
    socket.addEventListener('error', (err) => {
        console.error('WEBSOCKET ERROR', err)
        isConnected.value = false
    })
}

/**
 * 수신된 메시지 가공 함수
 * - 서버 데이터를 받아서 우리 화면에 맞는 형태(Message Item)로 변환해 목록에 추가합니다.
 */
const handleIncomingMessage = (data) => {
    // 1. 이중으로 인코딩된 JSON 문자열 처리 (가끔 서버에서 문자열을 두 번 감싸 보낼 때가 있음)
    if (typeof data === 'string') {
        try {
            if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
                const doubleParsed = JSON.parse(data)
                if (typeof doubleParsed === 'object' && doubleParsed !== null) {
                    data = doubleParsed
                }
            }
        } catch (e) { /* 변환 실패하면 무시하고 원본 사용 */ }
    }

    // 2. 현재 시간 포맷팅 (예: 14:30)
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    // 3. 데이터 필드 추출
    let textContent = ''
    let userId = 'Unknown'
    let userName = null
    let userImg = null

    // 데이터가 객체라면(정상적인 JSON) 내부 필드 추출
    if (typeof data === 'object' && data !== null) {
        textContent = data.text || data.msg || data.message || data.content
        if (!textContent) textContent = JSON.stringify(data) // 내용 없으면 전체 덤프
        userId = data.userId || data.sender || data.id || data.user || 'Unknown'
        userName = data.userName || data.name
        userImg = data.userImg || data.img
    } else {
        // 데이터가 그냥 문자열이면 그대로 내용으로 사용
        textContent = String(data)
    }

    // 4. 내가 보낸 메시지가 메아리쳐서 돌아온 경우 무시 (이미 화면에 그렸으므로)
    if (userId === myUserId.value) return

    // 5. 보낸 사람 정보 매핑 (usersData에서 상세 정보 찾기)
    //const senderInfo = usersData[userId] || usersData['Unknown']
    const senderInfo = usersData.value[userId] || usersData.value['Unknown']

    // 화면에 표시할 최종 유저 객체 조립
    const displayUser = {
        ...senderInfo,
        name: userName || senderInfo.name, // 메시지에 이름이 있으면 우선 사용
        img: userImg || senderInfo.img
    }

    // 6. 최종 메시지 목록에 추가
    messages.value.push({
        id: Date.now() + Math.random(), // 고유 ID 생성
        type: 'other', // 상대방이 보낸 메시지
        userId: userId,
        text: textContent,
        time: timeStr,
        user: displayUser // 프로필 표시용 정보
    })
}

// =========================================
// 4. 사용자 액션 (메시지 전송, 프로필 보기)
// =========================================

/**
 * 메시지 전송 함수
 * @param {string} textToSend - 입력창에 적은 텍스트
 */
const sendMessage = (textToSend) => {
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    // 1. Optimistic Update (낙관적 업데이트)
    // 서버 응답 기다리지 않고 내 화면에 먼저 말풍선 띄우기 (반응속도 향상)
    messages.value.push({
        id: Date.now(),
        type: 'me',
        text: textToSend,
        time: timeStr
    })

    // 2. 실제 서버로 전송
    if (socket && isConnected.value) {
        const payload = {
            userId: myUserId.value,
            userName: myUserName.value,
            userImg: myUserImg.value,
            text: textToSend,
            timestamp: now.toISOString()
        }
        // 객체를 문자열로 바꿔서 전송
        socket.send(JSON.stringify(payload))
    } else {
        // 연결 끊겼을 때 안내 메시지
        messages.value.push({
            id: Date.now() + 1,
            type: 'system',
            text: '⚠️ 메시지를 전송할 수 없습니다 (연결 끊김)'
        })
    }
}

/**
 * 프로필 모달 열기
 * @param {string} userId - 클릭한 사용자의 ID
 */
const openProfile = (userId) => {

    // usersData.value로 접근
    const data = usersData.value[userId] || usersData.value['Unknown']
    // currentProfile 반응형 객체에 데이터 덮어쓰기
    Object.assign(currentProfile, {
        id: userId,
        ...data,
        isBlocked: false
    })

    // 모달 표시
    isProfileModalOpen.value = true
}

// 하위 컴포넌트(Header, MemberList)에서 내 이름을 쓸 수 있도록 전달
provide('myUserName', myUserName)
</script>

<template>
    <!-- 전체 레이아웃 컨테이너 -->
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">
        <!-- 왼쪽 여백 (데스크탑에서만 보임, 균형 맞추기용) -->
        <div class="hidden md:block w-20 shrink-0"></div>
        <!-- 메인 콘텐츠 영역 (채팅창 + 사이드바) -->
        <main class="flex-1 flex gap-6 overflow-hidden h-[calc(100vh-2rem)]">
            
            <!-- 1. 로딩 중일 때 표시할 화면 -->
            <!-- v-if="isLoading": 데이터 불러오는 중이면 이 박스를 보여줍니다. -->
            <div v-if="isLoading" class="flex-1 flex items-center justify-center bg-white/50 rounded-[2.5rem]">
                <p class="text-slate-500 font-bold animate-pulse">대화 내용을 불러오는 중...</p>
            </div>

            <!-- 2. 채팅 패널 (메인 화면) -->
            <!-- v-else: 로딩이 끝나면(!isLoading) 이 패널을 보여줍니다. -->
            <ChatPanel 
                v-else
                :messages="messages" 
                :ride-info="rideInfo"
                :is-connected="isConnected" 
                @send-message="sendMessage"
                @open-profile="openProfile" 
            />

            <!-- 3. 우측 사이드바 (참여자 목록 등) -->
            <RideSidebar 
                :user-profiles="usersData" 
                :ride-info="rideInfo"
                @open-profile="openProfile" 
            />
        </main>

        <!-- 3. 프로필 모달 (팝업) -->
        <!-- 조건부 렌더링이 아니라 v-show나 내부 로직으로 제어 (is-open prop 전달) -->
        <ProfileModal 
            :is-open="isProfileModalOpen" 
            :profile="currentProfile" 
            @close="isProfileModalOpen = false" 
        />

    </div>
</template>