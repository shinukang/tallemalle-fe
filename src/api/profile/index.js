import api from '@/plugins/axiosinterceptor'

const profile = async (req) => {
  try {
    const res = await api.get('/json/profile', req)
    return res
  } catch (error) {
    console.log('프로필 요청 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

const history = async (req) => {
  try {
    const res = await api.get('/json/history', req)
    return res
  } catch (error) {
    console.log('탑승 기록 요청 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

const review = async (req) => {
  try {
    const res = await api.get('/json/reviews', req)
    return res
  } catch (error) {
    console.log('사용자 리뷰 요청 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

const payment = async (req) => {
  try {
    const res = await api.get('/json/payment', req)
    return res
  } catch (error) {
    console.log('결제 수단 목록 조회 실패', error)
    console.error('에러 상세:', error.response ? error.response.data : error.message)
    return error
  }
}

export default { profile, history, review, payment }
