// nav.html을 가져와서 특정 요소에 넣는 함수
async function loadNavbar(activeId) {
  try {
    const response = await fetch("nav.html");
    const html = await response.text();

    // 1. 네비게이션이 들어갈 자리에 HTML 삽입
    const container = document.getElementById("navbar-container");
    if (container) {
      container.innerHTML = html;
      // 중요: 팝업이 부모 요소의 overflow에 잘리지 않도록 스타일 확인
      // container의 css에 relative가 있으면 좋습니다.
    }

    // 2. 현재 페이지에 해당하는 버튼 활성화 (색상 변경)
    if (activeId) {
      const activeBtn = document.getElementById(activeId);
      if (activeBtn) {
        activeBtn.classList.add("active");
        if (activeId === "nav-mypage") {
          activeBtn.classList.add(
            "border-indigo-600",
            "ring-4",
            "ring-indigo-50"
          );
          activeBtn.classList.remove("border-white");
        }
      }
    }

    // 3. 아이콘 다시 렌더링
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 4. [NEW] 외부 클릭 시 알림 팝업 닫기 이벤트 등록
    document.addEventListener("click", function (e) {
      const popup = document.getElementById("global-notification-popup");
      const btn = document.getElementById("nav-notifications");

      if (popup && !popup.classList.contains("hidden")) {
        // 팝업 내부나 알림 버튼을 클릭한 게 아니라면 닫기
        if (!popup.contains(e.target) && !btn.contains(e.target)) {
          popup.classList.add("hidden");
        }
      }
    });
  } catch (error) {
    console.error("네비게이션 바 로딩 실패:", error);
  }
}

// [NEW] 알림 팝업 토글 함수
function toggleNotification(event) {
  event.stopPropagation(); // 버튼 클릭 시 즉시 닫히는 것 방지
  const popup = document.getElementById("global-notification-popup");

  if (popup) {
    popup.classList.toggle("hidden");

    // 팝업이 열릴 때 아이콘 다시 그리기 (동적 생성된 요소일 수 있으므로)
    if (!popup.classList.contains("hidden") && window.lucide) {
      window.lucide.createIcons();
    }
  }
}
