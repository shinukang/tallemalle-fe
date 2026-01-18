import api from '@/plugins/axiosinterceptor'

const login = async (req) => {
  try {
    const res = await api.post('/user/login', req)
    return res
  } catch (error) {
    console.log('로그인 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

const signup = async (req) => {
  try {
    const res = await api.post('/user/join', req)
    return res
  } catch (error) {
    console.log('회원가입 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

export default { login, signup }
