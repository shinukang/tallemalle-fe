import api from '@/plugins/axiosinterceptor'

const noticeList = async (req) => {
  const res = await api.get('/json/notice', req)

  return res.data
}

const getNoticeDetail = async (noticeId) => {
  const res = await api.get('/json/notice_detail')
  console.log(res.data.data[noticeId])

  // 전체 목록 중 해당 num(ID)을 가진 데이터만 찾아서 반환
  // JSON 구조가 { "1": {...}, "2": {...} } 형태일 때:
  return { data: res.data.data[noticeId] }
}

const faqList = async (req) => {
  const res = await api.get('/json/faq', req)
  console.log(res.data)

  return res.data
}

export default { noticeList, getNoticeDetail, faqList }
