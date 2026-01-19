import api from '@/plugins/axiosinterceptor'

// 주행 경로 데이터 가져오기
const getNavigationPath = async () => {
  try {
    const res = await api.get('/json/driverNavigation')
    console.log('경로 데이터 수신 성공:', res)
    return res
  } catch (error) {
    console.error('경로 데이터 로드 실패', error)
    throw error
  }
}

export default { signup, login, getNavigationPath }
