import { defineStore } from 'pinia'
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

  // 프로필 정보 로드 및 세션 스토리지 동기화
  const loadProfile = (loadedProfile) => {
    userInfo.profile = loadedProfile
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  // 탑승 기록 로드 및 세션 스토리지 동기화
  const loadHistory = (loadedHistory) => {
    userInfo.history = loadedHistory
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  // 리뷰 정보 로드 및 세션 스토리지 동기화
  const loadReview = (loadedReview) => {
    userInfo.review = loadedReview
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }

  // 결제 정보 로드 및 세션 스토리지 동기화
  const loadPayment = (loadedPayment) => {
    userInfo.payment = loadedPayment
    sessionStorage.setItem('UserInfo', JSON.stringify(userInfo))
  }
  return { userInfo, loadProfile, loadPayment, loadHistory, loadReview }
})
