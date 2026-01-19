import { defineStore } from 'pinia'
import api from '@/api/profile'
import { reactive } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const userInfo = reactive({
    profile: {
      name: '',
      nickname: '',
      phone: '',
      bio: '',
      rating: 0,
      styles: ['style-1', 'style-3', 'style-5'],
      image: '',
    },
    history: [],
    review: [],
    payment: {
      default: 0,
      list: [],
    },
  })

  const loadUserInfo = async () => {
    try {
      await Promise.all([loadProfile(), loadHistory(), loadReview(), loadPayment()])
    } catch (error) {
      console.error('USERINFO: ', error)
    }
  }

  const loadProfile = async () => {
    try {
      const res = await api.profile()
      if (res.data) {
        Object.assign(userInfo.profile, res.data)
      }
    } catch (error) {
      console.error('PROFILE: ', error)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await api.history()
      if (res.data) {
        userInfo.history = res.data
      }
    } catch (error) {
      console.error('HISTORY: ', error)
    }
  }

  const loadReview = async () => {
    try {
      const res = await api.review()
      if (res.data) {
        userInfo.review = res.data
      }
    } catch (error) {
      console.error('REVIEW: ', error)
    }
  }

  const loadPayment = async () => {
    try {
      const res = await api.payment()
      if (res.data) {
        userInfo.payment = res.data
      }
    } catch (error) {
      console.error('PAYMENT', error)
    }
  }

  const addPayment = async (payment) => {
    if (userInfo.payment.list.length < 2) {
      userInfo.payment.list.push(payment)

      if (userInfo.payment.list.length === 1) {
        userInfo.payment.default = payment.id
      }
    }
  }

  return { userInfo, loadUserInfo, addPayment }
})
