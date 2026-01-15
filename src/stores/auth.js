import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('tm_user')) || null)
    const router = useRouter()

    function login(email, nickname) {
        const userData = { id: email, nickname, loginAt: Date.now() }
        user.value = userData
        localStorage.setItem('tm_user', JSON.stringify(userData))
        // router.push('/') // 컴포넌트에서 처리하거나 여기서 처리
    }

    function logout() {
        user.value = null
        localStorage.removeItem('tm_user')
        window.location.href = '/login' // 확실한 리셋을 위해
    }

    return { user, login, logout }
})