import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/deploy',
        params
    })
}

export function add(data) {
    return request({
        url: '/deploy',
        method: 'post',
        data
    })
}

export function deploy(id) {
    return request({
        url: '/deploy/deploy/' + id,
        method: 'post'
    })
}

export function del(id) {
    return request({
        url: '/deploy/' + id,
        method: 'delete'
    })
}
