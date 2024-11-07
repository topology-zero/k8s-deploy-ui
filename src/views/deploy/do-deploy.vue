<template>
    <el-dialog :title="'发布项目/' + formData.deployName"
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
            <el-button :type="butObj.type"
                       @click="submitForm()"
                       :loading="deployStatus == 1">{{ butObj.text}}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { watch, ref, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deploy } from './api'
import { useWebsocket } from '@/utils/mixin/websocket'

const { logMessage, statusMessage } = useWebsocket(import.meta.env.VITE_APP_BASE_API + 'websocket')

const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

const messageInnerRef = ref()
watch(logMessage, async () => {
    await nextTick()
    messageInnerRef.value.scrollTop = messageInnerRef.value.scrollHeight
}, { deep: true })

const dialogMessage = computed(() => {
    return logMessage.value.get(formData.value.id)
})

const deployStatus = computed(() => {
    return statusMessage.value.get(formData.value.id)
})

const butObj = computed(() => {
    switch (statusMessage.value.get(formData.value.id)) {
        case 0: return {
            text: '上线',
            type: 'primary'
        }
        case 1: return {
            text: '上线中',
            type: 'default'
        }
        case 2: return {
            text: '重新上线',
            type: 'success'
        }
        case 3: return {
            text: '重新上线',
            type: 'warning'
        }
    }
    return {}
})

const submitForm = async () => {
    if (deployStatus.value != 0) {
        await ElMessageBox.confirm('是否重新上线', '警告')
    }
    await deploy(formData.value.id)
    visible.value = false
    ElMessage.success('成功')
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
