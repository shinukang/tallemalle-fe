<template>
  <section class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
      <component :is="icon" v-if="icon" class="w-5 h-5 text-indigo-600" />
      {{ title }}
    </h3>
    <slot></slot>
  </section>
</template>

<script setup>
defineProps(['title', 'icon'])
</script>