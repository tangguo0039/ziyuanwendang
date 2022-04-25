import request from '@/utils/request'
export default {
    getList:function(params) {
        return request({
            url: '/trade/list',
            method: 'get',
            params
        })
    },
    add:function(params) {
        return request({
            url: '/trade',
            method: 'post',
            params
        })
    },
    update:function(params) {
        return request({
            url: '/trade',
            method: 'PUT',
            params
        })
    },
    remove:function(id) {
        return request({
            url: '/trade',
            method: 'delete',
            params: {
                id: id
            }
        })
    }
}
