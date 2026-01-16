<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
    label: String,
    modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="space-y-2">
        <label class="text-xs font-bold text-slate-400">{{ label }}</label>
        <div class="relative">
            <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
                class="w-full pl-4 py-4 pr-10 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none border border-slate-100 focus:border-indigo-300 transition-all cursor-pointer">
                <option value="Now">지금 바로</option>
                <option value="10분 후">10분 후</option>
                <option value="20분 후">20분 후</option>
            </select>
            <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
    </div>
</template>