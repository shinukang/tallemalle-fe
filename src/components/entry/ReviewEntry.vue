<script setup></script>

<template>
  <div
    class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all"
  >
    <div class="flex items-center gap-3 mb-4">
      <img
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna"
        class="w-10 h-10 rounded-full bg-white border"
      />
      <div>
        <p class="text-xs font-bold text-slate-800">루나님</p>
        <p class="text-[10px] text-slate-400">강남역 → 판교역</p>
      </div>
    </div>
    <Quote class="absolute top-6 right-6 w-4 h-4 text-slate-200" />
    <p class="text-sm text-slate-600 leading-relaxed italic">
      "시간 약속을 정말 칼같이 지키셔서 너무 좋았어요!"
    </p>
    <div class="mt-4 flex gap-1">
      <Star v-for="i in 5" :key="i" class="w-3 h-3 text-amber-400 fill-amber-400" />
    </div>
  </div>
</template>

<style scoped></style>
