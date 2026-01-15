<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    ArrowLeft, Bell, ShieldCheck, ChevronRight, HelpCircle,
    ExternalLink, ChevronDown, ChevronUp
} from 'lucide-vue-next'

const router = useRouter()

// 마케팅 수신 동의 상태 (토글용)
const marketingConsent = ref(true)
</script>

<template>
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <div class="hidden md:block w-20 shrink-0"></div>

        <div
            class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col relative bg-white/90 backdrop-blur border border-white/50 shadow-xl">
            <div class="p-8 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                <button @click="router.back()"
                    class="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500">
                    <ArrowLeft class="w-6 h-6" />
                </button>
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">환경 설정</h1>
                    <p class="text-sm text-slate-400 font-medium mt-1">앱 알림, 보안 및 고객 지원 설정을 관리합니다.</p>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-4xl mx-auto space-y-8">

                    <section class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Bell class="w-5 h-5 text-indigo-600" />
                            알림 설정
                        </h3>

                        <div class="space-y-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-bold text-slate-700">마케팅 정보 수신</p>
                                    <p class="text-xs text-slate-400 mt-1">이벤트, 쿠폰 및 프로모션 소식을 푸시 알림으로 받습니다.</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="marketingConsent" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
                                    </div>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ShieldCheck class="w-5 h-5 text-indigo-600" />
                            계정 및 보안
                        </h3>

                        <div class="divide-y divide-slate-50">
                            <router-link to="/changepassword"
                                class="w-full py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl px-2 group cursor-pointer">
                                <span class="text-sm font-medium text-slate-700">비밀번호 변경</span>
                                <ChevronRight
                                    class="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform" />
                            </router-link>

                            <router-link to="/blocklist"
                                class="w-full py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl px-2 group cursor-pointer">
                                <span class="text-sm font-medium text-slate-700">차단한 사용자 관리</span>
                                <ChevronRight
                                    class="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-transform" />
                            </router-link>

                            <div class="w-full py-4 flex items-center justify-between px-2">
                                <span class="text-sm font-medium text-slate-700">안심번호 사용 설정</span>
                                <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">사용
                                    중</span>
                            </div>
                        </div>
                    </section>

                    <div class="pb-12">
                        <div class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h3 class="text-sm font-bold text-slate-900 mb-4">앱 정보</h3>
                            <div class="space-y-3 text-sm text-slate-500">
                                <div class="flex justify-between">
                                    <span>현재 버전</span>
                                    <span class="font-bold text-slate-800">v1.2.4</span>
                                </div>
                                <router-link to="/terms"
                                    class="flex justify-between cursor-pointer hover:text-indigo-600 group transition-colors">
                                    <span class="group-hover:font-semibold">이용약관</span>
                                    <ExternalLink class="w-4 h-4" />
                                </router-link>
                                <router-link to="/privacy"
                                    class="flex justify-between cursor-pointer hover:text-indigo-600 group transition-colors">
                                    <span class="group-hover:font-semibold">개인정보 처리방침</span>
                                    <ExternalLink class="w-4 h-4" />
                                </router-link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 커스텀 스크롤바 */
.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>