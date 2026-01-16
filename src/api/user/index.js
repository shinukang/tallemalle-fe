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

// --- Main.vue 함수 ---
const getRecruitList = async () => {
  try {
    const res = await api.get('/json/recruit_list')
    console.log(res)
    return res
  } catch (error) {
    console.log('모집 리스트 로드 실패', error)
    return error
  }
}


export default { login, signup, getRecruitList }
