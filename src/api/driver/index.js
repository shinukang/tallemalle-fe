import api from '@/plugins/axiosinterceptor'

const signup = async (req) => {
  const res = await api.post('/user/join', req)
  console.log('/user/index.js에서 res변수:', res)
  return res
}

const login = async (req) => {
  const res = await api.post('/user/login', req)
  console.log('/user/index.js에서 res변수:', res)
  return res
}

// 주행 경로 데이터 가져오기
const getNavigationPath = async () => {
  try {
    const res = await api.get('/json/driverNavigation')
    console.log('🚗 경로 데이터 수신 성공:', res)
    return res
  } catch (error) {
    console.log('❌ 경로 데이터 로드 실패', error)
    return error
  }
}

export default { signup, login, getNavigationPath }
