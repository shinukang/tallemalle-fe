<script setup>
/**
 * [파일 설명]
 * 이 파일은 사이드바 하단의 '참여 멤버 리스트'를 담당하는 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 현재 채팅방에 참여 중인 사람들의 목록을 보여줍니다.
 * 2. '나'는 항상 목록 맨 위에 고정해서 보여줍니다.
 * 3. 다른 사람을 클릭하면 상세 프로필을 요청합니다.
 */

import { inject, computed } from 'vue'
import MemberListItem from './MemberListItem.vue' // 멤버 한 명을 그리는 부품

/**
 * Props 정의
 * - userProfiles: ChatView(할아버지) -> RideSidebar(부모) -> MemberList(나) 순서로 내려받은
 * 전체 유저들의 데이터 객체입니다. (예: { "id1": {...}, "id2": {...} })
 */
const props = defineProps({
  userProfiles: {
    type: Object,
    default: () => ({}),
  },
})

/**
 * Emits 정의
 * - open-profile: 멤버 리스트에서 누군가를 클릭했을 때 "이 사람 프로필 열어줘"라고 신호를 보냅니다.
 */
const emit = defineEmits(['open-profile'])

/**
 * Inject (데이터 주입)
 * - ChatView.vue에서 provide('myUserName', ...) 했던 값을 여기서 바로 받아서 씁니다.
 * - 로그인한 '내 이름'을 표시하기 위함입니다.
 */
const myUserName = inject('myUserName', '익명')

/**
 * [NEW] 실시간 멤버 수 계산
 * - 내 자신(1명) + userProfiles 목록 중 'Unknown'이 아닌 유저 수
 */
const currentMemberCount = computed(() => {
  // Unknown 유저는 카운트에서 제외 (데이터 로딩 전 기본값 등)
  const othersCount = Object.keys(props.userProfiles).filter((id) => id !== 'Unknown').length
  return 1 + othersCount
})
</script>

<template>
  <!-- 
      멤버 리스트 컨테이너
      - flex-1: 남은 세로 공간을 꽉 채웁니다.
      - overflow-y-auto: 목록이 길어지면 스크롤이 생기도록 합니다.
    -->
  <div
    class="bg-white/90 backdrop-blur p-6 rounded-[2.5rem] flex-1 overflow-y-auto custom-scroll border border-white/50 shadow-sm"
  >
    <!-- [UPDATE] 멤버 수 바인딩 -->
    <!-- 이제 사람이 들어오면 숫자가 자동으로 올라갑니다. -->
    <h3 class="font-bold text-slate-900 mb-4 text-sm">
      참여 멤버 <span class="text-indigo-600">({{ currentMemberCount }}명)</span>
    </h3>

    <div class="space-y-4">
      <!-- 1. 내 프로필 (맨 위에 고정) -->
      <!-- 
               :is-me="true" -> 나 자신임을 표시 (디자인이 다를 수 있음)
               이미지는 예시용(Mock) URL을 사용했습니다.
            -->
      <MemberListItem
        :name="myUserName"
        img="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        sub-text="매너점수 42점"
        :is-me="true"
      />

      <!-- 2. 다른 멤버들 반복문 출력 -->
      <!-- 
               v-for="(profile, id) in userProfiles": 유저 데이터 객체를 돌면서 하나씩 꺼냅니다.
               v-if="id !== 'Unknown'": '알수없음' 유저는 목록에 표시하지 않습니다.
               @item-click: 클릭 시 해당 멤버의 id를 담아 open-profile 이벤트를 발생시킵니다.
            -->
      <template v-for="(profile, id) in userProfiles" :key="id">
        <MemberListItem
          v-if="id !== 'Unknown'"
          :name="profile.name"
          :img="profile.img"
          sub-text="프로필 보기"
          @item-click="emit('open-profile', id)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 스크롤바 디자인 (MessageList와 동일) */
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
