import api from '@/plugins/axiosinterceptor'

const blockList = async (req) => {
  const res = await api.get('/json/block_list', req)

  return res.data
}

export default { blockList }
