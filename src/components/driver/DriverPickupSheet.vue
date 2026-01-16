<script setup>
import { Phone, Navigation2 } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  passengerName: String,
  location: String,
})

defineEmits(['start-drive', 'call-passenger'])
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out will-change-transform pb-safe"
    :class="show ? 'translate-y-0' : 'translate-y-full'"
  >
    <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-6"></div>
    <div class="px-6 pb-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-2xl font-black text-slate-900">{{ passengerName }}</h3>
          <p class="text-slate-500 font-medium">{{ location }}</p>
        </div>
        <button
          @click="$emit('call-passenger')"
          class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors"
        >
          <Phone class="w-6 h-6" />
        </button>
      </div>
      <button
        @click="$emit('start-drive')"
        class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Navigation2 class="w-5 h-5" />
        <span>주행 시작</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
