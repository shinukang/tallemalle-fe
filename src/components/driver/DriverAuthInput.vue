<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  errorMessage: String,
  icon: Object,
})

defineEmits(['update:modelValue', 'blur'])
</script>

<template>
  <div class="space-y-1">
    <label class="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">
      {{ label }}
    </label>
    <div
      class="input-group flex items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3.5 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
    >
      <component :is="icon" class="w-5 h-5 text-slate-500 mr-3 transition-colors" />
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        :placeholder="placeholder"
        class="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full font-medium"
        required
      />
    </div>
    <Transition name="shake">
      <p v-if="errorMessage" class="text-xs text-red-400 ml-2 mt-1 font-medium">
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.input-group:focus-within svg {
  color: #34d399;
  transform: scale(1.1);
}
.shake-enter-active {
  animation: shake 0.5s;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
