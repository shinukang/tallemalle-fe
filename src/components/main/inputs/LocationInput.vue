<script setup>
defineProps({
    label: String,
    modelValue: String,
    placeholder: String,
    labelColor: { type: String, default: 'text-slate-500' } // 라벨 색상 (초록/빨강)
})
defineEmits(['update:modelValue'])
</script>

<template>
    <div
        class="bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:border-indigo-300 focus-within:bg-white transition-all">
        <span class="text-[10px] font-bold block mb-1" :class="labelColor">{{ label }}</span>
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text"
            class="w-full bg-transparent font-bold text-slate-800 outline-none placeholder-slate-400"
            :placeholder="placeholder">
    </div>
</template>