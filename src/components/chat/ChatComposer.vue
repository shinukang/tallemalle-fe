<script setup>
/**
 * [파일 설명]
 * 이 파일은 채팅방 하단 '메시지 입력 영역'입니다.
 * * * 주요 역할:
 * 1. 사용자가 입력한 텍스트를 관리(v-model)하고, 전송 버튼을 누르면 부모에게 전달합니다.
 * 2. '+' 버튼을 누르면 사진, 카메라, 위치 등을 선택할 수 있는 팝업 메뉴를 열고 닫습니다.
 */

import { ref } from 'vue'
import { Image, Camera, MapPin, Smile, PlusCircle, Send } from 'lucide-vue-next' // 다양한 아이콘들

/**
 * Emits 정의
 * - send-message: 사용자가 '전송' 버튼을 누르거나 엔터키를 쳤을 때 발생합니다.
 * 입력된 텍스트 내용을 함께 올려보냅니다.
 */
const emit = defineEmits(['send-message', 'send-image'])

/**
 * 상태 변수
 * - inputMessage: 입력창에 현재 적혀있는 글자들
 * - isPlusMenuOpen: 왼쪽 '+' 메뉴가 열려있는지(true), 닫혀있는지(false)
 */
const inputMessage = ref('')
const isPlusMenuOpen = ref(false)
const fileInput = ref(null) // 숨겨진 파일 인풋 참조

/**
 * [기능 함수] 플러스 메뉴 토글
 * - 열려있으면 닫고, 닫혀있으면 엽니다.
 */
const togglePlusMenu = () => {
  isPlusMenuOpen.value = !isPlusMenuOpen.value
}

/**
 * [기능 함수] 메시지 전송 처리
 * 1. 빈 내용인지 확인합니다. (공백만 있으면 전송 X)
 * 2. 부모에게 메시지 내용을 전달합니다.
 * 3. 입력창을 비우고, 열려있던 플러스 메뉴도 닫습니다.
 */
const handleSend = () => {
  // .trim(): 문자열 양쪽 공백 제거. 내용이 없으면 함수 종료(return).
  if (!inputMessage.value.trim()) return

  emit('send-message', inputMessage.value)

  // 전송 후 초기화
  inputMessage.value = ''
  isPlusMenuOpen.value = false
}

/**
 * 사진 버튼 클릭 시 파일 인풋 트리거
 */
const triggerFileUpload = () => {
  fileInput.value.click()
}

/**
 * 파일 선택 시 처리
 * - 원본 파일을 그대로 보내면 용량 초과로 소켓이 끊기므로, Canvas를 이용해 압축합니다.
 * - 15KB 제한을 맞추기 위해 점진적으로 압축률을 높입니다.
 */
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    // 이미지를 캔버스에 그려서 리사이징 및 압축 수행
    const img = new window.Image() // 이름 충돌 방지 위해 window.Image 사용
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 초기 설정: 15KB 제한이므로 시작부터 작게 잡음 (기존 800 -> 400)
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

      // 1. 초기 압축 (품질 0.7)
      let quality = 0.7
      let compressedBase64 = canvas.toDataURL('image/jpeg', quality)

      // 2. 용량 체크 및 재압축 루프
      // 15KB ≈ 15360 Bytes. Base64 인코딩 시 약 33% 증가하므로 문자열 길이는 약 20480자 제한.
      // 안전 마진을 두어 18000자(약 13KB)를 목표로 설정
      const MAX_LENGTH = 18000

      while (compressedBase64.length > MAX_LENGTH && (quality > 0.1 || maxSize > 100)) {
        // 품질을 먼저 낮춤
        if (quality > 0.3) {
          quality -= 0.2
        } else {
          // 품질이 한계에 도달하면 크기를 줄임
          maxSize *= 0.8
          width *= 0.8
          height *= 0.8
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height) // 리사이징된 크기로 다시 그림
        }
        compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      }

      // 최종 확인: 그래도 너무 크면 전송 차단
      if (compressedBase64.length > MAX_LENGTH * 1.5) {
        alert('이미지 용량을 충분히 줄일 수 없어 전송에 실패했습니다.')
        return
      }

      emit('send-image', compressedBase64)
      isPlusMenuOpen.value = false
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)

  // 같은 파일을 다시 선택할 수 있도록 인풋 초기화
  event.target.value = ''
}
</script>

<template>
  <!-- 
      입력창 전체 영역
      - relative: 플러스 메뉴(absolute)의 위치 기준점이 됩니다.
      - z-20: 다른 요소들보다 위에 뜨도록 설정
    -->
  <div class="relative shrink-0 z-20">
    <!-- 숨겨진 파일 업로드 인풋 -->
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
    <!-- 1. 플러스 메뉴 (숨겨진 팝업) -->
    <!-- 
           absolute bottom-24: 입력창보다 위쪽(24만큼)에 띄웁니다.
           transition-all duration-300: 부드럽게 나타나고 사라지는 애니메이션 효과
           :class="..." -> isPlusMenuOpen 값에 따라 투명도(opacity)와 크기(scale)를 조절해 보여주거나 숨깁니다.
        -->
    <div
      class="absolute bottom-24 left-6 w-52 bg-white/95 backdrop-blur rounded-[2rem] p-5 z-30 grid grid-cols-2 gap-4 border border-slate-100 shadow-xl transition-all duration-300 origin-bottom-left"
      :class="isPlusMenuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'"
    >
      <!-- 메뉴 아이템들 (사진, 카메라, 위치, 이모지) -->
      <button @click="triggerFileUpload" class="flex flex-col items-center gap-2 group">
        <div
          class="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all"
        >
          <Image class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold text-slate-500">사진</span>
      </button>
      <button class="flex flex-col items-center gap-2 group">
        <div
          class="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all"
        >
          <MapPin class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold text-slate-500">위치</span>
      </button>
    </div>

    <!-- 2. 하단 입력바 (항상 보임) -->
    <div class="p-6 bg-white border-t border-slate-50">
      <!-- 회색 둥근 박스 -->
      <div
        class="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.5rem] border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all"
      >
        <!-- 플러스 버튼 -->
        <!-- 클릭 시 togglePlusMenu 실행. 메뉴가 열리면 45도 회전(rotate-45)시켜서 'X' 모양처럼 만듦 -->
        <button
          @click="togglePlusMenu"
          class="p-2 text-slate-400 hover:text-indigo-600 transition-all focus:outline-none"
          :class="{ 'rotate-45 text-indigo-600': isPlusMenuOpen }"
        >
          <PlusCircle class="w-6 h-6" />
        </button>

        <!-- 텍스트 입력 필드 -->
        <!-- 
                   v-model="inputMessage": 자바스크립트 변수와 실시간 동기화
                   @keyup.enter: 엔터키를 누르면 handleSend 함수 실행
                -->
        <input
          v-model="inputMessage"
          @keyup.enter="handleSend"
          type="text"
          placeholder="메시지를 입력하세요..."
          class="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 py-2"
        />

        <!-- 전송 버튼 -->
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
