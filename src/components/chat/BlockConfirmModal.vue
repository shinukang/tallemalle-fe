<script setup>
/**
 * [파일 설명]
 * 사용자 차단 전 확인을 받는 모달입니다.
 * - 차단 시 메시지 및 매칭 제한에 대한 안내 문구를 보여줍니다.
 */
import { Ban } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <Teleport to="body">
    <!-- 배경 오버레이 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity"
      @click="close"
    >
      <!-- 모달 컨텐츠 -->
      <div
        class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 flex flex-col items-center text-center animate-scale-up"
        @click.stop
      >
        <!-- 아이콘 -->
        <div
          class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4"
        >
          <Ban class="w-8 h-8" />
        </div>

        <!-- 텍스트 -->
        <h3 class="text-lg font-bold text-slate-900 mb-2">이 사용자를 차단하시겠습니까?</h3>
        <p class="text-sm text-slate-500 mb-8 leading-relaxed">
          차단하면 서로의 메시지를 볼 수 없으며,<br />향후 탑승 매칭이 제한됩니다.
        </p>

        <!-- 버튼 그룹 -->
        <div class="flex gap-3 w-full">
          <button
            @click="close"
            class="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
          >
            취소
          </button>
          <button
            @click="confirm"
            class="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-rose-600 transition-all"
          >
            차단하기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-up {
  animation: scale-up 0.2s ease-out forwards;
}
</style>
