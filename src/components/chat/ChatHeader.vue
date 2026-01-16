<script setup>
import { MapPin, LogOut } from 'lucide-vue-next'
</script>

<template>
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 shrink-0">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
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
</template>