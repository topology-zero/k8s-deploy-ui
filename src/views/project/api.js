import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/project',
        params
    })
}

export function add(data) {
    return request({
        url: '/project',
        method: 'post',
        data
    })
}

export function edit(id, data) {
    return request({
        url: '/project/' + id,
        method: 'put',
        data
    })
}

export function del(id) {
    return request({
        url: '/project/' + id,
        method: 'delete'
    })
}
