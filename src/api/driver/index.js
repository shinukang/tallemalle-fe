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
 * 주행 경로 데이터 가져오기
 * method: GET
 * url: /json/driverNavigation
 */
const getNavigationPath = async () => {
  const res = await api.get('/json/driverNavigation')
  return res
}

export default {
  getNavigationPath,
}
