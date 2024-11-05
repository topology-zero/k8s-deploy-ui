import { onMounted, ref } from 'vue'
import ReconnectingWebSocket from 'reconnecting-websocket'

const websocketTarget = ref(null)
const message = ref(new Map())
const notify = new Map()
notify.set('done', [])

export function registerNotify(key, fn) {
    if (!notify.has(key)) {
        return
    }
    notify.get(key).push(fn)
}

export function useWebsocket(address = 'ws://127.0.0.1:8888/websocket') {
    onMounted(() => {
        if (websocketTarget.value != null) {
            return
        }
        websocketTarget.value = new ReconnectingWebSocket(address)
        websocketTarget.value.onmessage = onMessage
        websocketTarget.value.onopen = onOpen
        websocketTarget.value.onerror = onError
        websocketTarget.value.onclose = onClose
    })

    return { websocketTarget, message }
}

const onMessage = (e) => {
    if (e.data == 'pong') {
        return
    }

    if (e.data == 'done') {
        notify.get('done').forEach(fn => fn())
        return
    }

    const getMessage = JSON.parse(e.data)
    if (getMessage instanceof Array) {
        getMessage.forEach(v => {
            if (!message.value.has(v.id)) {
                message.value.set(v.id, [])
            }
            message.value.get(v.id).push(v)
        })
    } else {
        if (!message.value.has(getMessage.id)) {
            message.value.set(getMessage.id, [])
        }
        message.value.get(getMessage.id).push(getMessage)
    }
}

const onOpen = (e) => {
    var pingIntval = setInterval(() => {
        if (websocketTarget.value.readyState == 1) {
            websocketTarget.value.send('ping')
        } else {
            clearInterval(pingIntval)
        }
    }, 5 * 1000)
}

const onError = (e) => {
    console.log('onError', e)
}

const onClose = (e) => {
    console.log('onClose', e)
}
