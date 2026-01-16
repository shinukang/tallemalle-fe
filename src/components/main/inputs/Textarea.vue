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
        <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            class="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none resize-none h-24 border border-slate-100 focus:border-indigo-300 focus:bg-white transition-all"
            :placeholder="placeholder"></textarea>
    </div>
</template>