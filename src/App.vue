<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { CarFront } from 'lucide-vue-next'
import TheSidebar from './components/layout/Nav.vue'

const route = useRoute()
const router = useRouter()

// 현재 페이지가 기사님 관련 페이지인지 확인
const isDriverMode = computed(() => {
  return route.path.startsWith('/driver')
})

const goToDriverLogin = () => {
  router.push('/driverlogin')
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50 relative flex">

    <div v-if="!route.meta.hideNavbar && !isDriverMode" class="absolute left-4 top-4 bottom-4 z-50 hidden md:block">
      <TheSidebar />
    </div>

    <button v-if="!isDriverMode" @click="goToDriverLogin"
      class="absolute top-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
      <CarFront class="w-4 h-4" />
      <span class="text-sm font-bold">기사님 모드</span>
    </button>

    <main class="flex-1 w-full h-full relative">
      <RouterView />
    </main>

  </div>
</template>

<style>
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>