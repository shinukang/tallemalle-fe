<script setup>
defineProps({
  income: { type: Number, default: 0 },
})
</script>

<template>
  <div
    class="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl min-w-[140px]"
  >
    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1"
      >Today's Income</span
    >
    <div class="flex items-baseline gap-1">
      <span class="text-2xl font-black text-white font-mono">{{ income.toLocaleString() }}</span>
      <span class="text-sm font-bold text-emerald-400">원</span>
    </div>
  </div>
</template>
