<template>
    <el-dialog title="发布项目"
               v-model="visible"
               :close-on-click-modal="false"
               width="50%">
        <div class="message-box"
             ref="messageInnerRef">
            <div v-for="v in dialogMessage"
                 class="message-text"
                 :key="v">
                <pre :style="{color: getLogColor(v.type)}">{{ v.createTime }} {{ v.message }}</pre>
            </div>
        </div>
        <template #footer>
            <el-button @click="visible = false">关 闭</el-button>
            <el-button type="success"
                       @click="submitForm()"
                       :loading="deployLoading">上线</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { watch, ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { deploy } from './api'
import { useWebsocket } from '@/utils/mixin/websocket'

const { logMessage } = useWebsocket(import.meta.env.VITE_APP_BASE_API + 'websocket')

const visible = defineModel('visible', { type: Boolean })
const props = defineProps(['formData'])

const messageInnerRef = ref()
watch(logMessage, async () => {
    await nextTick()
    messageInnerRef.value.scrollTop = messageInnerRef.value.scrollHeight
}, { deep: true })

const dialogMessage = computed(() => {
    return logMessage.value.get(-1)
})

const deployLoading = ref(false)
const submitForm = async () => {
    deployLoading.value = true
    logMessage.value.set(-1, [])
    try {
        await deploy(props.formData)
        ElMessage.success('成功')
    } finally {
        deployLoading.value = false
    }
}

const getLogColor = (type) => {
    switch (type) {
        case 0: return 'gray'
        case 1: return 'green'
        case 2: return 'yellow'
        case 3: return 'red'
    }
    return 'green'
}
</script>
<style lang="scss" scoped>
.message-box {
    height: 400px;
    padding: 5px 10px;
    overflow: scroll;
    background: rgba(0, 0, 0, 0.8);
    color: green;

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.8);
        -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 1);
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.8);
        -webkit-box-shadow: inset 0 0 10px rgba(255, 255, 255, 1);
    }

    pre {
        margin: 5px;
        font-size: 12px;
    }
}
</style>
