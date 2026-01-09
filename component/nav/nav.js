/**
 * ==========================================
 * [nav.js] 공통 네비게이션 관리 스크립트
 * ==========================================
 * * 역할:
 * 1. nav.html(PC 사이드바)을 비동기(fetch)로 로드하여 페이지에 삽입
 * 2. 현재 페이지(activeId)에 해당하는 메뉴 활성화 스타일 적용
 * 3. 알림 팝업 열기/닫기 및 외부 클릭 감지 로직 처리
 */

/**
 * [1] 네비게이션 바 로드 및 초기화 함수
 * @param {string} activeId - 현재 페이지에서 활성화할 메뉴 버튼의 ID (예: 'nav-home')
 */
async function loadNavbar(activeId) {
  try {
    // 1. nav.html 파일 가져오기 (비동기 요청)
    const response = await fetch("/component/nav/nav.html");

    // 가져온 HTML 텍스트 변환
    const html = await response.text();

    // 2. 네비게이션이 들어갈 컨테이너에 HTML 삽입
    const container = document.getElementById("navbar-container");
    if (container) {
      container.innerHTML = html;
      // (참고: 팝업 위치를 위해 container의 CSS에 relative가 있으면 좋습니다)
    }

    // 3. 현재 페이지 버튼 활성화 (색상/스타일 변경)
    if (activeId) {
      const activeBtn = document.getElementById(activeId);
      if (activeBtn) {
        // 기본 활성화 클래스 추가 (색상 변경 등)
        activeBtn.classList.add("active");

        // [특수 케이스] 마이페이지 프로필 사진 테두리 강조
        if (activeId === "nav-mypage") {
          activeBtn.classList.add(
            "border-indigo-600", // 보라색 테두리
            "ring-4",            // 외곽 링 효과
            "ring-indigo-50"     // 링 색상
          );
          activeBtn.classList.remove("border-white"); // 기존 흰색 테두리 제거
        }
      }
    }

    // 4. 아이콘 다시 렌더링 (동적으로 추가된 HTML이라 수동 호출 필요)
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 5. [이벤트] 외부 클릭 시 알림 팝업 닫기
    document.addEventListener("click", function (e) {
      const popup = document.getElementById("global-notification-popup");
      const btn = document.getElementById("nav-notifications");

      // 팝업이 존재하고, 열려있는 상태라면
      if (popup && !popup.classList.contains("hidden")) {
        // 클릭한 곳이 '팝업 내부'도 아니고 '알림 버튼'도 아니라면 -> 닫기
        if (!popup.contains(e.target) && !btn.contains(e.target)) {
          popup.classList.add("hidden");
        }
      }
    });

  } catch (error) {
    console.error("네비게이션 바 로딩 실패:", error);
  }
}

/**
 * [2] 알림 팝업 토글 함수
 * - 알림 버튼 클릭 시 호출됨
 * @param {Event} event - 클릭 이벤트 객체
 */
function toggleNotification(event) {
  // 이벤트 전파 중단 (이게 없으면 document 클릭 이벤트가 바로 발생해 팝업이 즉시 닫힘)
  event.stopPropagation();

  const popup = document.getElementById("global-notification-popup");

  if (popup) {
    // hidden 클래스를 넣었다 뺐다 함 (보이기/숨기기)
    popup.classList.toggle("hidden");

    // 팝업이 열릴 때, 내부 아이콘이 렌더링 안 되어 있을 수 있으므로 다시 그림
    if (!popup.classList.contains("hidden") && window.lucide) {
      window.lucide.createIcons();
    }
  }
}