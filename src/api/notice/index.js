import api from '@/plugins/axiosinterceptor'

const noticeList = async (req) => {
  const res = await api.get('/json/notice', req)

  return res.data
}

export default { noticeList }
