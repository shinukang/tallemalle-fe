<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS (라이브러리 -> 컴포넌트)
 * ==============================================================================
 */
import RideInfoCard from './RideInfoCard.vue'
import MemberList from './MemberList.vue'

/**
 * ==============================================================================
 * 2. CONFIG & PROPS (설정 및 Props/Emits 정의)
 * ==============================================================================
 */
// Props 정의
defineProps({
  userProfiles: {
    type: Object,
    default: () => ({}), // 데이터가 없으면 빈 객체로 안전하게 초기화
  },
  rideInfo: {
    type: Object,
    default: null,
  },
})

// Emits 정의
const emit = defineEmits(['open-profile'])

/**
 * ==============================================================================
 * 3. METHODS - UI INTERACTION (화면 조작 및 이벤트 처리)
 * ==============================================================================
 */
// 프로필 열기 요청 핸들러 (MemberList -> RideSidebar -> ChatView)
const handleOpenProfile = (userId) => {
  emit('open-profile', userId)
}
</script>

<template>
  <!-- 
      사이드바 컨테이너 스타일링
      - w-80: 너비를 고정합니다 (약 320px).
      - gap-6: 내부 요소(카드, 리스트) 사이의 간격을 띄웁니다.
      - hidden xl:flex: 
        -> 기본적으로는 숨김(hidden) 처리하여 모바일 공간을 확보하고,
        -> 화면이 아주 넓은(xl breakpoint) 경우에만 flex로 보이게 하는 '반응형' 처리입니다.
    -->
  <aside class="w-80 flex flex-col gap-6 h-full overflow-hidden hidden xl:flex">
    <!-- 1. 여정 정보 카드 (지도, 출발/도착지 등 정적 정보) -->
    <RideInfoCard :ride-info="rideInfo" />

    <!-- 2. 멤버 리스트 영역 -->
    <MemberList :user-profiles="userProfiles" @open-profile="handleOpenProfile" />
  </aside>
</template>
