import api from '@/plugins/axiosinterceptor'

const profile = async (req) => {
  try {
    const res = await api.get('/json/profile/profile', req)
    return res
  } catch (error) {
    console.log('프로필 요청 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

export default { profile }
