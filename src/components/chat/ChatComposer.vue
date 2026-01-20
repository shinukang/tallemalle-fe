<script setup>
/**
 * [파일 설명]
 * 이 파일은 채팅방 하단 '메시지 입력 영역'입니다.
 * * * 주요 역할:
 * 1. 사용자가 입력한 텍스트를 관리(v-model)하고 전송합니다.
 * 2. 왼쪽 사진 버튼을 누르면 바로 갤러리(파일 선택)를 엽니다. (지도 기능 삭제됨)
 */

import { ref } from 'vue'
import { Image, Send } from 'lucide-vue-next' // 불필요한 아이콘(MapPin, Smile, PlusCircle) 제거

/**
 * Emits 정의
 */
const emit = defineEmits(['send-message', 'send-image'])

/**
 * 상태 변수
 * - inputMessage: 입력창 텍스트
 * - fileInput: 숨겨진 파일 인풋 참조
 * - (메뉴 관련 상태 isPlusMenuOpen 삭제됨)
 */
const inputMessage = ref('')
const fileInput = ref(null)

/**
 * [기능 함수] 메시지 전송 처리
 */
const handleSend = () => {
  if (!inputMessage.value.trim()) return

  emit('send-message', inputMessage.value)

  // 전송 후 초기화
  inputMessage.value = ''
}

/**
 * 사진 버튼 클릭 시 파일 인풋 트리거
 */
const triggerFileUpload = () => {
  fileInput.value.click()
}

/**
 * 파일 선택 시 처리 (이미지 압축 로직 유지)
 */
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let maxSize = 200
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      let quality = 0.7
      let compressedBase64 = canvas.toDataURL('image/jpeg', quality)

      const MAX_LENGTH = 18000

      while (compressedBase64.length > MAX_LENGTH && (quality > 0.1 || maxSize > 100)) {
        if (quality > 0.3) {
          quality -= 0.2
        } else {
          maxSize *= 0.8
          width *= 0.8
          height *= 0.8
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
        }
        compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      }

      if (compressedBase64.length > MAX_LENGTH * 1.5) {
        alert('이미지 용량을 충분히 줄일 수 없어 전송에 실패했습니다.')
        return
      }

      emit('send-image', compressedBase64)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}
</script>

<template>
  <div class="relative shrink-0 z-20">
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />

    <div class="p-6 bg-white border-t border-slate-50">
      <div
        class="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.5rem] border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all"
      >
        <button
          @click="triggerFileUpload"
          class="p-2 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none"
        >
          <Image class="w-6 h-6" />
        </button>

        <input
          v-model="inputMessage"
          @keyup.enter="handleSend"
          type="text"
          placeholder="메시지를 입력하세요..."
          class="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 py-2"
        />

        <button
          @click="handleSend"
          class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md hover:bg-indigo-700 transition-all"
        >
          <Send class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
