/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * ==============================================================================
 * 2. CONFIG & STORES (Auth Store 정의)
 * ==============================================================================
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'

// 다른 페이지에서 const authStore = useAuthStore() 변수 선언해주고
// authStore.user, authStore.user.id, authStore.user.email 이런식으로 사용하면 됨

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('USERINFO')) || null)

    function login(userInfo) {
        const userData = userInfo
        user.value = userData
        localStorage.setItem('USERINFO', JSON.stringify(userData))
    }

    function logout() {
        user.value = null
        localStorage.removeItem('USERINFO')
        window.location.href = '/login' // 확실한 리셋을 위해
    }

    return { user, login, logout }
})