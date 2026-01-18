import api from '@/plugins/axiosinterceptor'

const getNotificationList = async () => {
  try {
    // public/data/notifications.json 경로를 호출
    const res = await api.get('/json/notifications')
    console.log('알림 데이터 수신:', res)
    return res
  } catch (error) {
    console.log('알림 리스트 로드 실패', error)
    return error
  }
}

export default { getNotificationList }
