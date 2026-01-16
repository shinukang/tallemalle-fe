<script setup>
import { TrafficCone, Crosshair } from 'lucide-vue-next'

defineProps({
  isTrafficOn: Boolean,
})

defineEmits(['toggle-traffic', 'recenter'])
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      @click="$emit('toggle-traffic')"
      class="w-12 h-12 rounded-xl backdrop-blur-md border shadow-lg flex items-center justify-center transition-all"
      :class="
        isTrafficOn
          ? 'bg-indigo-600 text-white border-indigo-500'
          : 'bg-white/90 text-slate-600 border-white/20'
      "
    >
      <TrafficCone class="w-6 h-6" />
    </button>
    <button
      @click="$emit('recenter')"
      class="w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 flex items-center justify-center text-slate-700 active:bg-slate-100"
    >
      <Crosshair class="w-6 h-6" />
    </button>
  </div>
</template>
