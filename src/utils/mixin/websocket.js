import { onMounted, ref } from 'vue'
import ReconnectingWebSocket from 'reconnecting-websocket'

const websocketTarget = ref(null)
const logMessage = ref(new Map())
const statusMessage = ref(new Map())

const notify = new Map()
notify.set('log_change', [])
notify.set('status_change', [])

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

    return { websocketTarget, logMessage, statusMessage }
}

const onMessage = (e) => {
    if (e.data == 'pong') {
        return
    }

    const getMessage = JSON.parse(e.data)
    if (getMessage.msgType == 'log_change') {
        notify.get('log_change').map(fn => fn(getMessage.data))
    }

    if (getMessage.msgType == 'status_change') {
        notify.get('status_change').map(fn => fn(getMessage.data))
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

registerNotify('log_change', (data) => {
    data.map(v => {
        if (!logMessage.value.has(v.id)) {
            logMessage.value.set(v.id, [])
        }
        logMessage.value.get(v.id).push(v)
    })
})

registerNotify('status_change', (data) => {
    statusMessage.value.set(data.pid, data.status)
})
