import api from '@/plugins/axiosinterceptor'

const getRecruitList = async () => {
    try {
        const res = await api.get('/json/recruit_list')
        console.log(res)
        return res
    } catch (error) {
        console.log('모집 리스트 로드 실패', error)
        return error
    }
}

export default { getRecruitList }