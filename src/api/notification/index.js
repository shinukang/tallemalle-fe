/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import api from '@/plugins/axiosinterceptor'

/**
 * ==============================================================================
 * 2. API DEFINITIONS
 * ==============================================================================
 */

/**
 * 알림 리스트 데이터 요청
 * method: GET
 * url: /json/notifications
 */
const getNotificationList = () => {
  const res = api.get('/json/notifications')
  return res
}

export default {
  getNotificationList,
}
