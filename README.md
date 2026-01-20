<div align="center">

# 🚕 TalleMalle (탈래말래)
### 실시간 위치 기반 동승 매칭 커뮤니티 서비스
<img src="img/tallemalle_logo.png" width="300"/>  

같은 방향, 같은 시간 — 더 스마트한 이동을 함께
</div>

---

## 👥 Team TalleMalle

<table align="center" width="100%">
<tr>
<td align="center" width="20%">
  <a href="https://github.com/shinukang">
    <img src="https://github.com/shinukang.png" width="90"><br/>
    <strong>강신우</strong>
  </a>
</td>
<td align="center" width="20%">
  <a href="https://github.com/saralove20">
    <img src="https://github.com/saralove20.png" width="90"><br/>
    <strong>김사라</strong>
  </a>
</td>
<td align="center" width="20%">
  <a href="https://github.com/pbgodsoo">
    <img src="https://github.com/pbgodsoo.png" width="90"><br/>
    <strong>박범수</strong>
  </a>
</td>
<td align="center" width="20%">
  <a href="https://github.com/hijaehyuk">
    <img src="https://github.com/hijaehyuk.png" width="90"><br/>
    <strong>이재혁</strong>
  </a>
</td>
<td align="center" width="20%">
  <a href="https://github.com/DongHyunj">
    <img src="img\be8b0b467effbbad.jpg" width="90"><br/>
    <strong>정동현</strong>
  </a>
</td>
</tr>
</table>

---

## 🛠 기술 스택

### DBMS

![Ubuntu](https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=FFFFFF)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

### Frontend
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Pinia](https://img.shields.io/badge/Pinia-FFD500?style=for-the-badge&logo=pinia&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-00B894?style=for-the-badge)

### Version Cntrol & Collaboration

![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

### Deployment
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-red?style=for-the-badge&logo=amazonaws&logoColor=white)

---

## 🚀 프로젝트 소개

### 🎯 서비스 한 줄 요약
**TalleMalle은 같은 경로로 이동하는 사람들을 실시간으로 연결하는 위치 기반 동승 커뮤니티 서비스**

<table width="100%">
<tr>
<td width="50%" valign="top">

### 🌐 Service Deployment

<a href="https://여기에-배포-도메인-주소" target="_blank">👉 TalleMalle 바로가기</a>

</td>
<td width="50%" valign="top">

### 🎨 Design

<a href="https://www.figma.com/design/6BxeWDZ9Ex9Xqae0dqT3tJ/TalleMalle?t=HvXokjkooTvJFMmy-1" target="_blank">👉 Figma 보러가기</a>

</td>
</tr>
</table>

### 🧩 기획 배경

- 늦은 시간 혼자 귀가하기 불안한 상황
- 택시 합승의 불편함과 신뢰 문제
- 실시간 위치 기반 커뮤니티형 매칭 서비스 필요

### 💡 해결 방향

| 문제 | 프론트엔드 접근 |
|--------|----------------|
| 정보 탐색이 느림 | 지도 기반 UI로 직관적 탐색 |
| 소통이 번거로움 | 채팅 UI 즉시 연결 |
| 모바일 사용성 부족 | 전 화면 모바일 반응형 설계 |

---

## ✨ 핵심 기능

| 기능 | 설명 |
|--------|--------|
| 📝 동승 모집글 작성 | 위치 검색 + 시간 + 인원 설정 |
| 🗺 실시간 지도 매칭 | 주변 동승글 마커 표시 |
| 🤝 참여 요청 & 승인 | 상태에 따른 버튼 UI 분기 |
| 💬 실시간 채팅 UI | WebSocket 기반 채팅 인터페이스 |
| 📱 모바일 UX 최적화 | 하단 네비게이션 구조 |

---

## 🧠 프론트엔드 구현 포인트

### 📍 지도 기반 UI 상태 관리
- 지도 이동 시 API 재호출
- Pinia로 모집글 전역 관리
- 마커 클릭 → 상세 패널 연동

### 💬 실시간 채팅 처리
- WebSocket 연결 유지
- 메시지 수신 시 자동 스크롤
- 참여자 권한에 따른 UI 제어

### 📱 반응형 컴포넌트 구조
- 모바일 우선 설계
- 공통 컴포넌트 분리 (Nav, Modal, Toast)
- viewport 변경 시 레이아웃 자동 전환

---

## 🔄 서비스 흐름

<div align="center">
회원가입 / 로그인 ➡️ 지도에서 주변 동승글 탐색 ➡️ 모집글 참여 요청 ➡️ 승인 후 채팅방 입장 ➡️ 동승 이동
</div>

---

## 📸 서비스 화면

- 메인 지도 화면
- 모집글 작성 모달
- 채팅 화면
- 마이페이지

---

## 🎥 기능 테스트

- 🗺 메인 & 지도: 링크
- 📝 모집글 작성: 링크
- 💬 채팅: 링크
- 👤 마이페이지: 링크

---

<div align="center">

## 🚕 Thanks for riding with TalleMalle!

</div>