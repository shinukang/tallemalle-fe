<script setup>
import { ref, reactive, onMounted, onUnmounted, provide } from 'vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import RideSidebar from '@/components/chat/RideSidebar.vue'
import ProfileModal from '@/components/chat/ProfileModal.vue'
import api from '@/api/user' // 실제 API 경로 확인 필요
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

// --- 1. 상태 관리 & WebSocket 설정 ---
const isConnected = ref(false)
let socket = null

// 내 정보 (초기값)
const myUserId = ref(`user_${Math.floor(Math.random() * 1000)}`)
const myUserName = ref('익명')
const myUserImg = ref('')

// 채팅 메시지 데이터
const messages = ref([
    { id: 1, type: 'date', text: 'Today' },
    { id: 2, type: 'system', text: "✨ 실시간 채팅방에 입장했습니다." }
])

// 유저 데이터베이스 (Mock + 실시간 매핑용)
const usersData = reactive({
    "Ji-su": {
        name: "지수", lv: "LV. 8", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su",
        meta: "가입 124일째 · 동승 48회", bio: '"주로 평일 아침 출근 시간에 판교역 근처에서 활동해요! 😊"',
        score: 88, rank: "상위 5%", stats: { time: 24, silent: 18 },
        reviews: [{ author: "에이든", date: "3일 전", content: "정말 친절하시고 시간도 딱 맞춰서 와주셨어요!" }]
    },
    "Aiden": {
        name: "에이든", lv: "LV. 5", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden",
        meta: "가입 42일째 · 동승 12회", bio: '"매너 있는 동승을 추구합니다. 조용히 가는 걸 선호해요!"',
        score: 72, rank: "상위 15%", stats: { time: 8, silent: 10 },
        reviews: [{ author: "지수", date: "1일 전", content: "대화가 정말 즐거웠습니다! 좋은 분이에요." }]
    },
    "Unknown": {
        name: "알수없음", lv: "LV. 1", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown",
        meta: "정보 없음", bio: "", score: 50, rank: "-", stats: { time: 0, silent: 0 }, reviews: []
    }
})

// 프로필 모달 상태
const isProfileModalOpen = ref(false)
const currentProfile = reactive({
    id: '', name: '', lv: '', img: '', meta: '', bio: '',
    score: 0, rank: '', stats: { time: 0, silent: 0 },
    reviews: [], isBlocked: false
})

// auth store에서 사용자 정보 가져오기
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// --- 2. WebSocket & 초기화 로직 ---
onMounted(() => {
  connectWebSocket()

  if (user.value) {
    myUserId.value = user.value.id || user.value.userId
    myUserName.value = user.value.name || user.value.nickname || user.value.userName || '익명'
    myUserImg.value = user.value.img || user.value.profileImage || user.value.userImg || ''
  } else {
    console.warn('[auth] 로그인 사용자 정보가 없습니다. localStorage USERINFO 확인 필요')
    console.log('[auth] localStorage USERINFO raw:', localStorage.getItem('USERINFO'))
  }
})

onUnmounted(() => {
    if (socket) {
        socket.close()
    }
})

const connectWebSocket = () => {
    const wsUri = "ws://54.180.30.27:8080/ws/chat"
    socket = new WebSocket(wsUri)

    socket.addEventListener('open', () => {
        console.log('WEBSOCKET CONNECTED')
        isConnected.value = true
    })

    socket.addEventListener('message', (e) => {
        try {
            const parsedData = JSON.parse(e.data)
            const payload = parsedData.payload !== undefined ? parsedData.payload : parsedData
            handleIncomingMessage(payload)
        } catch (err) {
            handleIncomingMessage(e.data)
        }
    })

    socket.addEventListener('close', () => {
        console.log('WEBSOCKET CLOSED')
        isConnected.value = false
    })

    socket.addEventListener('error', (err) => {
        console.error('WEBSOCKET ERROR', err)
        isConnected.value = false
    })
}

const handleIncomingMessage = (data) => {
    // 이중 인코딩 JSON 처리
    if (typeof data === 'string') {
        try {
            if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
                const doubleParsed = JSON.parse(data)
                if (typeof doubleParsed === 'object' && doubleParsed !== null) {
                    data = doubleParsed
                }
            }
        } catch (e) { /* ignore */ }
    }

    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    let textContent = ''
    let userId = 'Unknown'
    let userName = null
    let userImg = null

    if (typeof data === 'object' && data !== null) {
        textContent = data.text || data.msg || data.message || data.content
        if (!textContent) textContent = JSON.stringify(data)
        userId = data.userId || data.sender || data.id || data.user || 'Unknown'
        userName = data.userName || data.name
        userImg = data.userImg || data.img
    } else {
        textContent = String(data)
    }

    if (userId === myUserId.value) return

    const senderInfo = usersData[userId] || usersData['Unknown']
    const displayUser = {
        ...senderInfo,
        name: userName || senderInfo.name,
        img: userImg || senderInfo.img
    }

    messages.value.push({
        id: Date.now() + Math.random(),
        type: 'other',
        userId: userId,
        text: textContent,
        time: timeStr,
        user: displayUser // 중요: MessageItem에서 사용할 객체 구조
    })
}

const sendMessage = (textToSend) => {
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    // Optimistic Update
    messages.value.push({
        id: Date.now(),
        type: 'me',
        text: textToSend,
        time: timeStr
    })

    if (socket && isConnected.value) {
        const payload = {
            userId: myUserId.value,
            userName: myUserName.value,
            userImg: myUserImg.value,
            text: textToSend,
            timestamp: now.toISOString()
        }
        socket.send(JSON.stringify(payload))
    } else {
        messages.value.push({
            id: Date.now() + 1,
            type: 'system',
            text: '⚠️ 메시지를 전송할 수 없습니다 (연결 끊김)'
        })
    }
}

// 프로필 열기 로직
const openProfile = (userId) => {
    const data = usersData[userId] || usersData['Unknown']
    Object.assign(currentProfile, {
        id: userId,
        ...data,
        isBlocked: false
    })
    isProfileModalOpen.value = true
}

// myUserName을 provide하여 하위 컴포넌트(헤더 등)에서 사용 가능하게 함
provide('myUserName', myUserName)
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <div class="hidden md:block w-20 shrink-0"></div>

        <main class="flex-1 flex gap-6 overflow-hidden h-[calc(100vh-2rem)]">
            <!-- 채팅 패널 -->
            <ChatPanel 
                :messages="messages" 
                :is-connected="isConnected" 
                @send-message="sendMessage"
                @open-profile="openProfile" 
            />

            <!-- 사이드바 -->
            <RideSidebar 
                :user-profiles="usersData" 
                @open-profile="openProfile" 
            />
        </main>

        <!-- 프로필 모달 (Chat.vue에서 통합 관리) -->
        <ProfileModal 
            :is-open="isProfileModalOpen" 
            :profile="currentProfile" 
            @close="isProfileModalOpen = false" 
        />

    </div>
</template>