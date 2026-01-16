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

export default { signup, login }
