<script setup>
defineProps({
  item: Object
})
</script>

<template>
  <RouterLink :to="{ name: 'noticedetail', params: { num: item.id } }" custom v-slot="{ navigate }">
    <div
      @click="navigate"
      class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group"
    >
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-2">
          <span :class="[
            item.tagClass || 'bg-indigo-100 text-indigo-600',
            'text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider',
          ]">
            {{ item.tag || '공지' }}
          </span>
          <span v-if="item.isEssential" class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
            필독
          </span>
        </div>
        <span class="text-[11px] font-medium text-slate-400">{{ item.date }}</span>
      </div>
      <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
        {{ item.title }}
      </h3>
      <p class="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
        {{ item.description }}
      </p>
    </div>
  </RouterLink>
</template>