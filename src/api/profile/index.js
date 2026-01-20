import api from '@/plugins/axiosinterceptor'

// 프로필 정보 조회 API
const profile = async (req) => {
  return await api.get('/json/profile', req)
}

// 탑승 기록 조회 API
const history = async (req) => {
  return await api.get('/json/history', req)
}

// 리뷰 데이터 조회 API
const review = async (req) => {
  return await api.get('/json/reviews', req)
}

// 결제 수단 목록 조회 API
const payment = async (req) => {
  return await api.get('/json/payment', req)
}

export default { profile, history, review, payment }
