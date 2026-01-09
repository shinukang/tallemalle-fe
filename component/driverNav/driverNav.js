// driverNav.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 아이콘 초기화 (만약 메인에서 실행되지 않았을 경우를 대비)
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. 출퇴근 토글 스위치 이벤트 리스너 등록
    const workToggle = document.getElementById('work-toggle');
    if (workToggle) {
        workToggle.addEventListener('change', function(e) {
            // 형제 요소인 label을 찾음
            const label = this.nextElementSibling;
            if (e.target.checked) {
                // 켜짐: 인디고 색상
                label.classList.replace('bg-slate-400', 'bg-indigo-500');
            } else {
                // 꺼짐: 회색
                label.classList.replace('bg-indigo-500', 'bg-slate-400');
            }
        });
    }
});

/**
 * 사이드바 열기/닫기 토글 함수
 * 메인 페이지의 햄버거 버튼이나 오버레이 클릭 시 호출됩니다.
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!sidebar || !overlay) return;

    const isHidden = sidebar.classList.contains('sidebar-hidden');
    
    if (isHidden) {
        // 열기
        overlay.classList.remove('hidden');
        // 부드러운 페이드인을 위해 약간의 지연 후 opacity 변경
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        sidebar.classList.remove('sidebar-hidden');
    } else {
        // 닫기
        sidebar.classList.add('sidebar-hidden');
        overlay.classList.add('opacity-0');
        // 애니메이션이 끝난 후 hidden 처리 (0.3초)
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}