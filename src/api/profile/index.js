import api from '@/plugins/axiosinterceptor'

const profile = async (req) => {
  return await api.get('/json/profile', req)
}

const history = async (req) => {
  return await api.get('/json/history', req)
}

const review = async (req) => {
  return await api.get('/json/reviews', req)
}

const payment = async (req) => {
  return await api.get('/json/payment', req)
}

export default { profile, history, review, payment }
