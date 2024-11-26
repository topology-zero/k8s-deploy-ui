import request from '@/utils/request'

export function deploy(data) {
    return request({
        url: '/run/deploy',
        method: 'post',
        data,
        timeout: 0
    })
}
