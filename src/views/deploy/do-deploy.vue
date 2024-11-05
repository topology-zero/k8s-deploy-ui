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
            <el-button type="primary"
                       @click="submitForm()"
                       :loading="submitLoding">{{ formData.status == 0 ? '上 线' :'重新上线'}}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { watch, ref, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { deploy } from './api'
import { useWebsocket } from '@/utils/mixin/websocket'

const { message } = useWebsocket()

const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

const messageInnerRef = ref()
watch(message, async () => {
    await nextTick()
    messageInnerRef.value.scrollTop = messageInnerRef.value.scrollHeight
}, { deep: true })

const dialogMessage = computed(() => {
    return message.value.get(formData.value.id, 1)
})

const submitLoding = ref(false)
const submitForm = async () => {
    submitLoding.value = true
    try {
        await deploy(formData.value.id)
        visible.value = false
        ElMessage.success('成功')
    } finally {
        submitLoding.value = false
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
