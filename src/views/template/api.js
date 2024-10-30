import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/template',
        params
    })
}

export function add(data) {
    return request({
        url: '/template',
        method: 'post',
        data
    })
}

export function edit(id, data) {
    return request({
        url: '/template/' + id,
        method: 'put',
        data
    })
}

export function del(id) {
    return request({
        url: '/template/' + id,
        method: 'delete'
    })
}
