/**
 * ==========================================
 * [server.js] 탈래말래 백엔드 서버
 * ==========================================
 * 역할:
 * 1. Express를 이용한 REST API 서버 (모집글 목록 조회)
 * 2. ws를 이용한 WebSocket 서버 (실시간 위치 공유, 모집글 생성/참여 알림)
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const url = require('url'); // URL 쿼리 파라미터 파싱용

// === [1] 서버 기본 설정 ===
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // HTTP 서버 위에 웹소켓 서버 얹기

// 미들웨어 설정
app.use(cors());          // 모든 도메인에서 요청 허용 (개발 편의성)
app.use(express.json());  // JSON 요청 본문 파싱 허용

// === [2] 데이터 저장소 (In-Memory DB) ===
// ※ 주의: 서버가 재시작되면 초기화됩니다. 실제 서비스에선 DB(MySQL, MongoDB 등)를 써야 합니다.

// 초기 샘플 모집 데이터
let recruits = [
    {
        id: 1,
        start: "강남역",
        dest: "판교역",
        time: "Now",
        desc: "신분당선 고장... 같이가요!",
        tags: ["#비흡연"],
        cur: 1, // 현재 인원
        max: 4  // 최대 인원
    },
    {
        id: 2,
        start: "서울역",
        dest: "합정역",
        time: "20:30",
        desc: "짐이 좀 있습니다.",
        tags: ["#캐리어"],
        cur: 2,
        max: 3
    }
];

// 접속한 웹소켓 클라이언트 관리 (Key: ws객체, Value: 유저정보)
let clients = new Map();

// === [3] REST API (HTTP 요청 처리) ===

/**
 * [GET] /recruits
 * 현재 등록된 모든 모집 글 목록을 반환합니다.
 * (클라이언트가 처음 접속하거나 새로고침할 때 호출)
 */
app.get('/recruits', (req, res) => {
    res.json(recruits);
});

// === [4] WebSocket 로직 (실시간 통신) ===

wss.on('connection', (ws, req) => {
    // 1. URL에서 userId 파싱 (예: ws://...?userId=user123)
    const parameters = url.parse(req.url, true).query;

    // 클라이언트가 보낸 userId가 있으면 사용, 없으면 랜덤 생성 (익명 접속 대비)
    const userId = parameters.userId || Math.random().toString(36).substring(7);

    // 유저별 고유 색상 랜덤 생성 (지도 마커용)
    const userColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    // 접속 유저 정보 저장
    clients.set(ws, { id: userId, lat: null, lng: null, color: userColor });
    console.log(`클라이언트 접속: ${userId}`);

    // 2. 메시지 수신 처리
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // [Case A] 위치 정보 공유 (type: location)
            if (data.type === 'location') {
                const client = clients.get(ws);
                client.lat = data.lat;
                client.lng = data.lng;
                clients.set(ws, client); // 정보 업데이트

                // 모든 사람에게 최신 위치 브로드캐스팅
                broadcastLocations();
            }

            // [Case B] 새 모집 글 생성 (type: createRecruit)
            else if (data.type === 'createRecruit') {
                const newRecruit = {
                    id: Date.now(), // 유니크 ID로 시간값 사용
                    cur: 1,         // 방장 포함 1명부터 시작
                    ...data.payload // 클라이언트가 보낸 정보 (start, dest, time, tags 등)
                };

                // 목록 맨 앞에 추가 (최신순)
                recruits.unshift(newRecruit);

                // 모든 클라이언트에게 "새 글 생겼어!" 알림 전송
                broadcastToAll({ type: 'newRecruit', recruit: newRecruit });
            }

            // [Case C] 모집 참여 (type: joinRecruit)
            else if (data.type === 'joinRecruit') {
                // ID로 해당 모집글 찾기
                const target = recruits.find(r => r.id === data.recruitId);

                // 모집글이 존재하고, 아직 꽉 차지 않았으면
                if (target && target.cur < target.max) {
                    target.cur += 1; // 인원 증가

                    // 변경된 정보(인원수)를 모든 클라이언트에게 전송 -> 실시간 반영
                    broadcastToAll({ type: 'updateRecruit', recruit: target });
                }
            }

        } catch (e) {
            console.error("메시지 처리 중 에러:", e);
        }
    });

    // 3. 접속 종료 처리
    ws.on('close', () => {
        clients.delete(ws); // 목록에서 제거
        broadcastLocations(); // 나간 사람 빼고 다시 위치 전송
    });
});

/**
 * [Helper] 현재 접속 중인 모든 사용자의 위치 정보를 전송
 * (위도/경도가 있는 사용자만 필터링)
 */
function broadcastLocations() {
    const userList = Array.from(clients.values()).filter(u => u.lat && u.lng);
    broadcastToAll({ type: 'updateUsers', users: userList });
}

/**
 * [Helper] 접속한 모든 클라이언트에게 데이터 전송 (브로드캐스트)
 */
function broadcastToAll(data) {
    const json = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

// === [5] 서버 실행 ===
server.listen(8080, () => {
    console.log('서버 실행 중 (HTTP + WebSocket) on port 8080');
});