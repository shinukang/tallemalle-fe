<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex-1 py-6 text-sm font-bold border-b-2 transition-all',
      active
        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
        : 'border-transparent text-slate-400 hover:text-slate-600 bg-white',
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  active: Boolean
})
defineEmits(['click'])
</script>