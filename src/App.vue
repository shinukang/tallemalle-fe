<script setup>
import { RouterView, useRoute } from 'vue-router'
import TheSidebar from './components/layout/Nav.vue'

const route = useRoute()
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50 relative flex">
    <div v-if="!route.meta.hideNavbar" class="absolute left-4 top-4 bottom-4 z-50 hidden md:block">
      <TheSidebar />
    </div>

    <main class="flex-1 w-full h-full relative">
      <RouterView />
    </main>

  </div>
</template>

<style>
/* 전역 스크롤바 스타일 */
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>