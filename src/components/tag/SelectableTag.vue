<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  const isChecked = event.target.checked
  const newValue = [...props.modelValue]

  if (isChecked) {
    if (!newValue.includes(props.value)) {
      newValue.push(props.value)
    }
  } else {
    const index = newValue.indexOf(props.value)
    if (index !== -1) {
      newValue.splice(index, 1)
    }
  }

  emit('update:modelValue', newValue)
}
</script>

<template>
  <label class="cursor-pointer group">
    <input
      type="checkbox"
      :checked="modelValue.includes(value)"
      @change="handleChange"
      class="peer hidden"
    />
    <span
      class="px-5 py-3 border border-slate-100 bg-white rounded-2xl text-xs font-bold text-slate-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 peer-checked:border-indigo-200 hover:border-indigo-200 transition-all block"
    >
      {{ label }}
    </span>
  </label>
</template>
