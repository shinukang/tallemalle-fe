import api from '@/plugins/axiosinterceptor'

// 회원가입
const signup = async (req) => {
  try {
    const res = await api.post('/user/join', req)
    console.log('회원가입 성공:', res)
    return res
  } catch (error) {
    console.error('회원가입 실패:', error)
    throw error 
  }
}

// 로그인
const login = async (req) => {
  try {
    const res = await api.post('/user/login', req)
    console.log('로그인 성공:', res)
    return res
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}

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
