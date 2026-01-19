import api from '@/plugins/axiosinterceptor'

const getRecruitList = async () => {
    const res = await api.get('/json/recruit_list')
    return res
}

export default { getRecruitList }