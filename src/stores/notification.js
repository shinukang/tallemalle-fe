import { defineStore } from 'pinia'
import notificationApi from '@/api/notification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),

  actions: {
    // API 호출
    async fetchNotifications() {
      try {
        const res = await notificationApi.getNotificationList()

        if (res && res.data) {
          this.notifications = res.data
        }
      } catch (error) {
        console.error('Store 업데이트 실패:', error)
        throw error
      }
    },

    markAllAsRead() {
      this.notifications.forEach((n) => (n.isRead = true))
    },
    markAsRead(id) {
      const item = this.notifications.find((n) => n.id === id)
      if (item) item.isRead = true
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
  persist: true,
})
