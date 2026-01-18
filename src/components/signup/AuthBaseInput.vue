<script setup>
defineProps(['modelValue', 'label', 'type', 'placeholder', 'icon', 'error']);
defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
      {{ label }}
    </label>
    <div 
      class="relative flex items-center bg-slate-50 border rounded-xl transition-all input-focus-within"
      :class="[error ? 'border-red-400 bg-red-50' : 'border-slate-200']" 
    >
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        :type="type"
        :placeholder="placeholder"
        class="w-full px-4 py-3.5 pl-12 bg-transparent rounded-xl focus:outline-none text-sm"
      />
      <div class="absolute left-4 text-slate-400">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1 ml-1 font-bold">{{ error }}</p>
  </div>
</template>

<style scoped>
.input-focus-within:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.input-focus-within:focus-within svg {
  color: #4f46e5;
}
</style>