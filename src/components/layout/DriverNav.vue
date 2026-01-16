<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  Star,
  History,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-vue-next'

const driverName = ref('')
const route = useRoute()
const router = useRouter()
const toast = useToast()

const hasNewMessage = ref(localStorage.getItem('chat_notification') === 'true')
let socket = null

// 소켓 연결 로직 (기능 유지)
const connectSocket = () => {
  const wsUri = 'ws://127.0.0.1:8080/ws/chat'
  socket = new WebSocket(wsUri)

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data)
      if (data.type !== 'USER_LIST' && data.sender !== driverName.value) {
        if (route.name !== 'driverchat') {
          // 알림 상태 저장
          hasNewMessage.value = true
          localStorage.setItem('chat_notification', 'true') // 새로고침 대비 저장

          toast.info(`${data.sender}: ${data.payload || data.message}`, {
            timeout: 5000,
            onClick: () => {
              clearNotification() // 클릭 시 알림 제거
              router.push({ name: 'driverchat' })
            },
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
  socket.onclose = () => setTimeout(connectSocket, 3000)
}

const clearNotification = () => {
  hasNewMessage.value = false
  localStorage.removeItem('chat_notification')
}

onMounted(() => {
  const userData = localStorage.getItem('tm_driver_id')
  driverName.value = userData || '미인증 기사'
  connectSocket()
})

onUnmounted(() => {
  if (socket) socket.close()
})

const showLogoutModal = ref(false)

const confirmLogout = () => {
  localStorage.clear()
  window.location.href = '/driverLogin'
}
</script>

<template>
  <div class="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
    <aside class="w-64 flex-none bg-[#0f172a] border-r border-white/5 flex flex-col h-full z-50">
      <div class="p-6 mb-2">
        <h1 class="text-indigo-500 font-black text-xl tracking-tight">탈래말래</h1>
      </div>

      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
        <p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          Main Navigation
        </p>

        <RouterLink
          :to="{ name: 'driverpage' }"
          class="nav-item"
          :class="{ active: route.name === 'driverpage' }"
        >
          <LayoutDashboard class="w-5 h-5 flex-shrink-0" />
          <span class="font-bold text-sm">대시보드</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'driverhistory' }"
          class="nav-item"
          :class="{ active: route.name === 'driverhistory' }"
        >
          <History class="w-5 h-5 flex-shrink-0" />
          <span class="font-bold text-sm">운행 히스토리</span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'driverchat' }"
          class="nav-item"
          :class="{ active: route.name === 'driverchat' }"
          @click="clearNotification"
        >
          <div class="relative flex-shrink-0">
            <MessageSquare class="w-5 h-5" />
            <span
              v-if="hasNewMessage"
              class="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"
            ></span>
          </div>
          <span class="font-bold text-sm flex-1">커뮤니티 채팅</span>
          <ChevronRight class="w-4 h-4 opacity-40" />
        </RouterLink>

        <div class="py-4"><div class="h-px bg-white/5"></div></div>

        <p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          Account
        </p>

        <RouterLink to="/nav/setting" class="nav-item">
          <Settings class="w-5 h-5 flex-shrink-0" />
          <span class="font-bold text-sm">시스템 설정</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-white/5">
        <button
          @click="showLogoutModal = true"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all font-bold text-sm"
        >
          <LogOut class="w-5 h-5" /> 로그아웃
        </button>
        <Teleport to="body">
          <div
            v-if="showLogoutModal"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div class="bg-[#1e293b] p-6 rounded-3xl border border-white/10 w-80 shadow-2xl">
              <h3 class="text-white font-bold text-lg mb-2">로그아웃</h3>
              <p class="text-slate-400 text-sm mb-6">
                정말 로그아웃 하시겠습니까? 운행 상태가 오프라인으로 변경됩니다.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showLogoutModal = false"
                  class="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold text-sm"
                >
                  취소
                </button>
                <button
                  @click="confirmLogout"
                  class="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </aside>

    <main class="flex-1 bg-[#020617] relative">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* 아이템들의 가로 정렬을 강제하는 스타일 */
.nav-item {
  display: flex !important;
  align-items: center !important;
  flex-direction: row !important; /* 세로로 깨지는 것 방지 */
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #94a3b8;
  transition: all 0.3s;
  text-decoration: none;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.nav-item.active {
  background-color: #4f46e5; /* indigo-600 */
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.nav-item.active span {
  color: white;
}
</style>
