import request from '@/utils/request'

export function getRoles() {
    return request({
        url: '/base/role'
    })
}

export function getAuths() {
    return request({
        url: '/base/auth'
    })
}

export function getProject() {
    return request({
        url: '/common/project'
    })
}

export function getTemplate() {
    return request({
        url: '/common/template'
    })
}

export function getProjectParams(id, params) {
    return request({
        url: '/common/project/params/' + id,
        params
    })
}
