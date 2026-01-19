import { defineStore } from "pinia";
import { ref } from "vue";

export const useRecruitStore = defineStore('recruit', () => {
    // 상태(Stae): localStorage에서 초기값 가져오기
    const status = ref(localStorage.getItem('myStatus') || 'IDLE')
    const recruitId = ref(Number(localStorage.getItem('myRecruitId')) || null)

    // 액션(Action): 상태 변경 함수
    // 방장이 되었을 때
    const setOwner = (id) => {
        status.value = 'OWNER'
        recruitId.value = id
        _saveToLocalStoreage()
    }

    // 참여자가 되었을 때
    const setJoined = (id) => {
        status.value = 'JOINED'
        recruitId.value = id
        _saveToLocalStoreage()
    }

    // 방에서 나갔을 때 (초기화)
    const clear = () => {
        status.value = 'IDLE'
        recruitId.value = null
        localStorage.removeItem('myStatus')
        localStorage.removeItem('myRecruitId')
    }

    // localStorage 저장용
    const _saveToLocalStoreage = () => {
        localStorage.setItem('myStatus', status.value)
        if (recruitId.value) {
            localStorage.setItem('myRecruitId', String(recruitId.value))
        }
    }

    return { status, recruitId, setOwner, setJoined, clear }
})