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
      method: [],
    },
  })

  const loadProfile = (loadedProfile) => {
    userInfo.profile = loadedProfile
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  const loadHistory = (loadedHistory) => {
    userInfo.history = loadedHistory
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  const loadReview = (loadedReview) => {
    userInfo.review = loadedReview
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  const loadPayment = (loadedPayment) => {
    userInfo.payment = loadedPayment
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  const addPayment = async (payment) => {
    if (userInfo.payment.method.length < 2) {
      userInfo.payment.method.push(payment)

      if (userInfo.payment.method.length === 1) {
        userInfo.payment.default = payment.id
      }
    }
  }

  return { userInfo, loadProfile, loadPayment, loadHistory, loadReview }
})
