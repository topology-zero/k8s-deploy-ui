import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/namespace',
        params
    })
}

export function add(data) {
    return request({
        url: '/namespace',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/namespace',
        method: 'delete',
        data
    })
}
