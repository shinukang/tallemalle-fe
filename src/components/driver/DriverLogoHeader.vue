<script setup>
import { CarFront } from 'lucide-vue-next'
</script>

<template>
    <div class="absolute top-6 left-6 z-30 select-none pointer-events-none">

        <div
            class="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 pr-6 rounded-2xl shadow-xl">

            <div
                class="w-11 h-11 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <CarFront class="w-6 h-6 text-white" />
            </div>

            <div>
                <h1 class="text-2xl font-black text-white tracking-tighter leading-none drop-shadow-lg filter">
                    탈래말래
                </h1>
                <p class="text-[10px] font-bold text-indigo-300 tracking-[0.2em] ml-0.5 mt-0.5">
                    DRIVER
                </p>
            </div>

        </div>
    </div>
</template>