<script setup>
/**
 * [파일 설명]
 * 이 파일은 채팅방 우측에 위치하는 '사이드바' 컴포넌트입니다.
 * * * 주요 역할:
 * 1. 현재 카풀/택시팟의 운행 정보(출발지, 도착지, 시간 등)를 보여줍니다.
 * 2. 현재 참여 중인 멤버들의 목록을 보여줍니다.
 * 3. PC 화면(xl 사이즈 이상)에서만 보이고, 모바일/태블릿 등 작은 화면에서는 숨겨집니다.
 * * * 구조:
 * [ RideInfoCard ] <- 상단: 지도, 경로, 시간 정보 카드
 * [ MemberList   ] <- 하단: 참여자 프로필 리스트
 */

import RideInfoCard from './RideInfoCard.vue'
import MemberList from './MemberList.vue'

/**
 * Props 정의
 * - userProfiles: ChatView(부모)에서 관리하는 전체 유저 데이터 객체입니다.
 * MemberList 컴포넌트가 각 멤버의 이름, 사진, 상태 메시지를 그릴 때 필요하므로 
 * 자식에게 전달하기 위해 받습니다.
 */
defineProps({
    userProfiles: {
        type: Object,
        default: () => ({}) // 데이터가 없으면 빈 객체로 안전하게 초기화
    }
})

/**
 * Emits 정의
 * - open-profile: 멤버 목록에서 특정 사람을 클릭했을 때 발생하는 이벤트입니다.
 * 여기서 직접 모달을 띄우지 않고, 부모(ChatView)에게 "이 사람 프로필 열어줘"라고 알립니다.
 */
const emit = defineEmits(['open-profile'])

/**
 * [이벤트 전달 함수] 프로필 열기 요청
 * - 자식(MemberList)에서 "누가 멤버를 클릭했어요!"라고 알리면 실행됩니다.
 * - 그대로 부모(ChatView)에게 토스(emit)합니다.
 */
const requestOpenProfile = (userId) => {
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
        <RideInfoCard />

        <!-- 2. 멤버 리스트 영역 -->
        <!-- 
           :user-profiles -> 부모에게 받은 유저 데이터를 그대로 전달
           @open-profile  -> 클릭 이벤트가 올라오면 위쪽 requestOpenProfile 함수 실행
        -->
        <MemberList 
            :user-profiles="userProfiles" 
            @open-profile="requestOpenProfile" 
        />
    </aside>
</template>