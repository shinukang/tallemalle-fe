<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="border-b border-slate-100 bg-white/50 w-full">
    <div class="max-w-5xl mx-auto px-8 py-8">
      <div class="flex items-center gap-3">
        <slot name="icon"></slot>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
          {{ title }}
        </h1>
      </div>
      <p v-if="description" class="text-sm text-slate-400 font-medium mt-1">
        {{ description }}
      </p>
    </div>
  </div>
</template>
