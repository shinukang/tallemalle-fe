<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { CarFront } from 'lucide-vue-next'
import TheSidebar from './components/layout/Nav.vue'
import DriverNav from './components/layout/DriverNav.vue'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path === '/login')
const isDriverMode = computed(() => route.path.startsWith('/driver'))
const isDriverContext = computed(() => isDriverMode.value && !route.meta.hideDriverNavbar)
const showSidebar = computed(() => !route.meta.hideNavbar && !isDriverMode.value)

const goToDriverLogin = () => router.push('/driverlogin')
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50 relative flex">

    <main class="flex-1 w-full h-full relative z-0">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <Transition name="fade">
      <button v-if="isLoginPage" @click="goToDriverLogin"
        class="absolute top-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
        <CarFront class="w-4 h-4" />
        <span class="text-sm font-bold">기사님 모드</span>
      </button>
    </Transition>

    <Transition name="slide-left">
      <div v-if="showSidebar" class="absolute left-4 top-4 bottom-4 z-50 hidden md:block">
        <TheSidebar />
      </div>
    </Transition>

    <Transition name="slide-left">
      <div v-if="isDriverContext"
        class="absolute left-4 top-4 bottom-4 z-50 flex flex-col justify-center pointer-events-none">

        <div
          class="pointer-events-auto relative shadow-2xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-slate-200">
          <DriverNav />
        </div>
      </div>
    </Transition>

  </div>
</template>

<style>
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}
</style>