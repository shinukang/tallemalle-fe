// nav.html을 가져와서 특정 요소에 넣는 함수
async function loadNavbar(activeId) {
    try {
        const response = await fetch('nav.html');
        const html = await response.text();
        
        // 1. 네비게이션이 들어갈 자리에 HTML 삽입
        document.getElementById('navbar-container').innerHTML = html;

        // 2. 현재 페이지에 해당하는 버튼 활성화 (색상 변경)
        if (activeId) {
            const activeBtn = document.getElementById(activeId);
            if (activeBtn) {
                activeBtn.classList.add('active'); // CSS에 정의된 .active 스타일 적용
                
                // 마이페이지의 경우 버튼이 아니라 div라서 테두리 색상 등을 추가로 처리
                if (activeId === 'nav-mypage') {
                    activeBtn.classList.add('border-indigo-600', 'ring-4', 'ring-indigo-50');
                    activeBtn.classList.remove('border-white');
                }
            }
        }

        // 3. 아이콘 다시 렌더링 (Lucide 아이콘이 동적으로 추가되었으므로)
        lucide.createIcons();

    } catch (error) {
        console.error('네비게이션 바 로딩 실패:', error);
    }
}