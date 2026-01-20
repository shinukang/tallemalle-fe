import api from '@/plugins/axiosinterceptor'

/**
 * 주행 경로 데이터 가져오기
 * @returns {Promise} Axios Response
 */
const getNavigationPath = () => {
  return api.get('/json/driverNavigation')
}

export default { getNavigationPath }
