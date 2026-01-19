<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['unblock'])
</script>

<template>
  <div class="p-5 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
        <img :src="user.img" class="w-full h-full object-cover grayscale opacity-70" />
      </div>
      <div>
        <h3 class="font-bold text-slate-800">{{ user.name }}</h3>
        <p class="text-xs text-slate-400 mt-0.5">{{ user.date }} 차단됨</p>
      </div>
    </div>
    <button 
      @click="$emit('unblock', user.id)"
      class="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
    >
      차단 해제
    </button>
  </div>
</template>