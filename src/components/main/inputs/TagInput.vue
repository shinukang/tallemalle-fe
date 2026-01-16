<script setup>
defineProps({
    label: String,
    modelValue: String,
    placeholder: String
})
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="space-y-2">
        <label class="text-xs font-bold text-slate-400">{{ label }}</label>
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text"
            class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none placeholder-slate-400 border border-slate-100 focus:border-indigo-300 focus:bg-white transition-all"
            :placeholder="placeholder">
    </div>
</template>