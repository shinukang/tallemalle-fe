<script setup>
import { ref, onMounted, nextTick } from 'vue'
import {
    MapPin, LogOut, Image, Camera, Smile, PlusCircle, Send, Info,
    MoreVertical, X, Ban, UserCheck
} from 'lucide-vue-next'

// --- 상태 데이터 ---
const messages = ref([
    { id: 1, type: 'date', text: 'Today' },
    {
        id: 2, type: 'other', text: '안녕하세요! 지금 2번 출구 앞에 노란색 카카오 택시 옆에 서있어요.',
        sender: '에이든', time: '18:21', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden'
    },
    {
        id: 3, type: 'me', text: '네, 확인했습니다! 저 지금 에스컬레이터 타고 올라가고 있어요. 1분만 기다려주세요!',
        time: '18:22'
    },
    { id: 4, type: 'system', text: "✨ '지수'님이 그룹에 참여했습니다." },
    {
        id: 5, type: 'other', text: '안녕하세요~ 저도 지금 거의 다 왔어요!',
        sender: '지수', time: '18:24', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su'
    }
])

const inputMessage = ref('')
const isPlusMenuOpen = ref(false)
const chatContainer = ref(null)

// 프로필 모달 상태
const isProfileModalOpen = ref(false)
const currentProfile = ref({})

// 탑승 상세 모달 상태
const isRideDetailModalOpen = ref(false)

// --- 메소드 ---
const sendMessage = () => {
    if (!inputMessage.value.trim()) return

    const now = new Date()
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

    messages.value.push({
        id: Date.now(),
        type: 'me',
        text: inputMessage.value,
        time: timeStr
    })

    inputMessage.value = ''
    scrollToBottom()
}

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

const togglePlusMenu = () => {
    isPlusMenuOpen.value = !isPlusMenuOpen.value
}

// 프로필 데이터 (데모용)
const userProfiles = {
    'Aiden': {
        name: '에이든', lv: 'LV. 5', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
        meta: '가입 42일째 · 동승 12회', bio: '"매너 있는 동승을 추구합니다."', score: 72
    },
    'Ji-su': {
        name: '지수', lv: 'LV. 8', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su',
        meta: '가입 124일째 · 동승 48회', bio: '"판교역 근처에서 활동해요! 😊"', score: 88
    }
}

const openProfile = (userId) => {
    if (userProfiles[userId]) {
        currentProfile.value = userProfiles[userId]
        isProfileModalOpen.value = true
    }
}

onMounted(() => {
    scrollToBottom()
})
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <div class="hidden md:block w-20 shrink-0"></div>

        <main class="flex-1 flex gap-6 overflow-hidden h-[calc(100vh-2rem)]">

            <div
                class="flex-1 flex flex-col glass-panel rounded-[2.5rem] overflow-hidden relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <MapPin class="w-6 h-6" />
                        </div>
                        <div>
                            <h2 class="font-bold text-slate-900">강남역 2번 출구 → 판교역</h2>
                            <p class="text-xs text-slate-400">현재 3명 참여 중 · 5분 후 출발</p>
                        </div>
                    </div>
                    <button class="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                        <LogOut class="w-5 h-5" />
                    </button>
                </div>

                <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                    <div v-for="msg in messages" :key="msg.id">

                        <div v-if="msg.type === 'date'" class="flex justify-center">
                            <span
                                class="text-[10px] font-bold text-slate-300 bg-slate-100 px-3 py-1 rounded-full uppercase">{{
                                msg.text }}</span>
                        </div>

                        <div v-else-if="msg.type === 'system'" class="flex justify-center">
                            <div class="bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/50">
                                <p class="text-[11px] text-indigo-400 font-medium">{{ msg.text }}</p>
                            </div>
                        </div>

                        <div v-else-if="msg.type === 'other'" class="flex items-end gap-3">
                            <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                @click="openProfile(msg.sender)">
                                <img :src="msg.avatar" alt="user" />
                            </div>
                            <div class="flex flex-col gap-1 max-w-[70%]">
                                <span class="text-[10px] text-slate-400 ml-1">{{ msg.sender }}</span>
                                <div
                                    class="bg-white border border-slate-100 p-3.5 text-sm leading-relaxed shadow-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-slate-800">
                                    {{ msg.text }}
                                </div>
                            </div>
                            <span class="text-[10px] text-slate-300 mb-1">{{ msg.time }}</span>
                        </div>

                        <div v-else-if="msg.type === 'me'" class="flex items-end gap-3 justify-end">
                            <span class="text-[10px] text-slate-300 mb-1">{{ msg.time }}</span>
                            <div class="flex flex-col gap-1 max-w-[70%] items-end">
                                <div
                                    class="bg-indigo-600 text-white p-3.5 text-sm leading-relaxed shadow-lg shadow-indigo-100 rounded-tl-2xl rounded-tr-xl rounded-bl-2xl">
                                    {{ msg.text }}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="absolute bottom-24 left-6 w-72 bg-white/95 backdrop-blur rounded-[2rem] p-5 z-30 grid grid-cols-4 gap-4 border border-slate-100 shadow-xl transition-all duration-300 origin-bottom-left"
                    :class="isPlusMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'">
                    <button class="flex flex-col items-center gap-2 group">
                        <div
                            class="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <Image class="w-6 h-6" />
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">사진</span>
                    </button>
                    <button class="flex flex-col items-center gap-2 group">
                        <div
                            class="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <Camera class="w-6 h-6" />
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">카메라</span>
                    </button>
                    <button class="flex flex-col items-center gap-2 group">
                        <div
                            class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <MapPin class="w-6 h-6" />
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">위치</span>
                    </button>
                    <button class="flex flex-col items-center gap-2 group">
                        <div
                            class="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                            <Smile class="w-6 h-6" />
                        </div>
                        <span class="text-[10px] font-bold text-slate-500">이모지</span>
                    </button>
                </div>

                <div class="p-6 bg-white border-t border-slate-50">
                    <div
                        class="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.5rem] border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">
                        <button @click="togglePlusMenu"
                            class="p-2 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none"
                            :class="{ 'rotate-45 text-indigo-600': isPlusMenuOpen }">
                            <PlusCircle class="w-6 h-6" />
                        </button>
                        <input v-model="inputMessage" @keyup.enter="sendMessage" type="text" placeholder="메시지를 입력하세요..."
                            class="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 py-2" />
                        <button @click="sendMessage"
                            class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all">
                            <Send class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <aside class="w-80 flex flex-col gap-6 h-full overflow-hidden hidden xl:flex">
                <div @click="isRideDetailModalOpen = true"
                    class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] shrink-0 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group relative border border-white/50 shadow-sm">
                    <div class="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info class="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 class="font-bold text-slate-900 mb-4 text-sm group-hover:text-indigo-600 transition-colors">여정
                        정보</h3>
                    <div class="space-y-4">
                        <div class="flex items-start gap-3">
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase">Start</p>
                                <p class="text-xs font-bold text-slate-700">강남역 2번 출구 앞</p>
                            </div>
                        </div>
                        <div class="ml-0.5 border-l-2 border-dashed border-slate-100 h-6"></div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                                <p class="text-xs font-bold text-slate-700">판교역 지하철 입구</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] flex-1 overflow-y-auto custom-scroll border border-white/50 shadow-sm">
                    <h3 class="font-bold text-slate-900 mb-4 text-sm">참여 멤버 <span class="text-indigo-600">(3/4)</span>
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-sm border-2 border-indigo-600">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900 flex items-center gap-1">판교동승왕 <span
                                        class="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md">나</span>
                                </p>
                                <p class="text-xs text-slate-400">매너점수 85점</p>
                            </div>
                        </div>
                        <div v-for="(profile, id) in userProfiles" :key="id"
                            class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl -mx-2 transition-colors"
                            @click="openProfile(id)">
                            <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-sm">
                                <img :src="profile.img" alt="user" />
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">{{ profile.name }}</p>
                                <p class="text-xs text-indigo-500 font-medium italic">프로필 보기</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>

        <div v-if="isProfileModalOpen"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click="isProfileModalOpen = false">
            <div class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" @click.stop>
                <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h3 class="font-bold text-slate-900">프로필 정보</h3>
                    <button @click="isProfileModalOpen = false"
                        class="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <div class="p-8 flex flex-col items-center text-center">
                    <div
                        class="w-24 h-24 rounded-[2.2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden mb-5">
                        <img :src="currentProfile.img" alt="profile" class="w-full h-full object-cover" />
                    </div>
                    <h2 class="text-2xl font-black text-slate-900">{{ currentProfile.name }}</h2>
                    <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-bold mt-1 mb-2">{{
                        currentProfile.lv }}</span>
                    <p class="text-xs text-slate-400 font-medium">{{ currentProfile.meta }}</p>
                    <div class="mt-6 w-full p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 font-medium">
                        {{ currentProfile.bio }}
                    </div>

                    <button
                        class="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                        @click="isProfileModalOpen = false">
                        확인
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isRideDetailModalOpen"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click="isRideDetailModalOpen = false">
            <div class="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6" @click.stop>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-bold text-slate-900">탑승 상세 정보</h3>
                    <button @click="isRideDetailModalOpen = false">
                        <X class="w-6 h-6 text-slate-400" />
                    </button>
                </div>
                <p class="text-sm text-slate-500 mb-6">여정 상세 정보가 여기에 표시됩니다.</p>
                <button @click="isRideDetailModalOpen = false"
                    class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">닫기</button>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* 커스텀 스크롤바 */
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>