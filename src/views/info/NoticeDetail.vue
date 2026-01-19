<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const noticeTitle = ref(route.params.id || '매너 온도 산정 방식 고도화 안내');

onMounted(() => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
</script>

<template>
    <div class="flex h-screen p-4 gap-4 bg-[#f8fafc] font-['Pretendard'] overflow-hidden">
        <div id="navbar-container" class="w-20 h-full shrink-0 rounded-[2.5rem]"></div>

        <div class="flex-1 glass-panel rounded-[2.5rem] overflow-hidden flex flex-col">
            <div class="border-b border-slate-100 bg-white/50 w-full">
                <div class="max-w-5xl mx-auto px-8 p-8">
                    <div>
                        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">공지사항</h1>
                        <p class="text-sm text-slate-400 font-medium mt-1">탈래말래의 새로운 소식과 자주 묻는 질문을 확인하세요.</p>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scroll p-8">
                <div class="max-w-5xl mx-auto">
                    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
                        <div class="space-y-4 border-b border-slate-50 pb-8">
                            <div class="flex gap-2">
                                <span
                                    class="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">공지</span>
                            </div>
                            <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">
                                {{ noticeTitle }}
                            </h2>
                            <div class="flex items-center text-slate-400 text-sm gap-4">
                                <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-4 h-4"></i>
                                    2024.03.15</span>
                                <span class="flex items-center gap-1.5"><i data-lucide="eye" class="w-4 h-4"></i> 조회수
                                    1,240</span>
                            </div>
                        </div>

                        <div class="text-slate-600 leading-[1.8] text-base space-y-6">
                            <p class="font-bold text-slate-800 text-lg">안녕하세요, 탈래말래 팀입니다.</p>
                            <p>
                                보다 쾌적하고 신뢰할 수 있는 동승 환경을 제공하기 위해 매너 온도 산정 방식이 다음과 같이 고도화될 예정입니다.
                                이번 업데이트는 사용자의 실제 이용 매너를 더욱 정밀하게 반영하는 데 중점을 두었습니다.
                            </p>
                            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                                <p class="font-bold text-indigo-600"> 주요 변경 사항</p>
                                <ul class="list-disc list-inside space-y-2 text-sm text-slate-500">
                                    <li>허위 매칭 신고 시 감점 요인 강화</li>
                                    <li>연속 클린 매칭 성공 시 보너스 점수 부여</li>
                                    <li>동승자 상호 평가 데이터의 신뢰도 알고리즘 적용</li>
                                </ul>
                            </div>
                            <p>
                                앞으로도 저희 탈래말래는 여러분의 소중한 의견을 경청하여 더 나은 서비스를 만들어가겠습니다.
                                관련하여 궁금하신 사항은 고객센터를 통해 문의해 주시기 바랍니다.
                            </p>
                            <p>감사합니다.</p>
                        </div>

                        <div class="pt-10 flex justify-center">
                            <button @click="$router.push('/notice')"
                                class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                                목록으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.glass-panel {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(30, 27, 75, 0.05);
}

.custom-scroll::-webkit-scrollbar {
    width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>