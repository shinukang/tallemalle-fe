import api from '@/plugins/axiosinterceptor'

const getNotificationList = async () => {
  try {
    const res = await api.get('/json/notifications')
    console.log('알림 데이터 수신:', res)
    return res
  } catch (error) {
    // 개발자가 볼 수 있게 로그 출력
    console.error('알림 리스트 로드 실패:', error)

    // 에러를 다시 던져야 Notification.vue의 catch 블록이 실행되어 'isError = true'가 됨
    throw error
  }
}

export default { getNotificationList }