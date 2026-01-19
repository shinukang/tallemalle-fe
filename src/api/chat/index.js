import api from '@/plugins/axiosinterceptor'

/**
 * 이전 채팅 내역 가져오기
 * @returns {Promise<Array>} 채팅 메시지 배열
 * @throws {Error} API 호출 실패 시 에러를 던짐
 */
const getChatHistory = async () => {
    try {
        const response = await api.get('/json/chat');
        return response.data;
    } catch (error) {
        console.error('[API] 이전 채팅 내역 조회 실패:', error);
        throw error; 
    }
}

/**
 * 채팅방 참여자 목록 가져오기
 * @returns {Promise<Object>} 사용자 ID를 키로 갖는 유저 정보 객체
 * @throws {Error} API 호출 실패 시 에러를 던짐
 */
const getChatParticipants = async () => {
    try {
        const response = await api.get('/json/participants');
        return response.data;
    } catch (error) {
        console.error('[API] 참여자 목록 조회 실패:', error);
        throw error;
    }
}

/**
 * 여정 상세 정보 가져오기
 * @returns {Promise<Object>} 여정 정보 객체
 * @throws {Error} API 호출 실패 시 에러를 던짐
 */
const getRideDetail = async () => {
    try {
        const response = await api.get('/json/ride_detail');
        return response.data;
    } catch (error) {
        console.error('[API] 여정 상세 정보 조회 실패:', error);
        throw error;
    }
}

export default { getChatHistory, getChatParticipants, getRideDetail }