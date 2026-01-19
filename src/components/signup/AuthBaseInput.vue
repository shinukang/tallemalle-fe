<script setup>
import { AlertCircle } from 'lucide-vue-next';
defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  icon: [Object, Function],
  error: String,
  variant: { type: String, default: 'auth' }, 
  iconPosition: { type: String, default: 'left' } ,
  bgColor: { type: String, default: '' } // 배경색 클래스를 직접 받을 수 있게 추가
});
defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="space-y-1.5 w-full"> <label v-if="label" class="text-sm font-bold text-slate-700 ml-1">{{ label }}</label>
    
    <div
      class="relative flex items-center transition-all focus-within:ring-4 focus-within:ring-indigo-500/10"
      :class="[bgColor ? bgColor : 'bg-slate-50',
        error ? 'border-red-400' : 'border-slate-200',
        'border rounded-xl focus-within:border-indigo-600'
      ]"
    >
      <component 
        v-if="icon && iconPosition === 'left'" 
        :is="icon" 
        class="absolute left-4 w-5 h-5 text-slate-400" 
      />
      
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        :type="type"
        :placeholder="placeholder"
        class="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 rounded-xl"
        :class="[
          // 로그인/사인업용 폰트 크기는 text-sm, 설정은 그대로
          variant === 'settings' ? 'py-4 text-base' : 'py-3.5 text-sm',
          iconPosition === 'left' ? 'pl-12 pr-4' : 'pl-4 pr-12'
        ]"
      />

      <component 
        v-if="icon && iconPosition === 'right'" 
        :is="icon" 
        class="absolute right-4 w-5 h-5 text-slate-300" 
      />
    </div>

    <div v-if="error" class="min-h-[1.25rem]">
      <p class="flex items-center text-red-500 text-xs mt-1 ml-1 font-medium">
        <AlertCircle class="w-3.5 h-3.5 mr-1" />
        {{ error }}
      </p>
    </div>
  </div>
</template>