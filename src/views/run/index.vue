<template>
    <div class="app-container">
        <p class="page-title">调试运行</p>

        <div class="yaml-box">
            <YamlEditor v-model="formData.yaml"
                        class="my-yaml-box" />
        </div>
        <div class="yaml-btn">
            <el-checkbox label="Dry Run"
                         v-model="formData.isDebug"
                         border />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button type="success"
                       :loading="runLoading"
                       :disabled="formData.yaml.length == 0"
                       @click="runLoading = true">
                <svg-icon icon-class="run"
                          v-if="!runLoading"></svg-icon>&nbsp;RUN
            </el-button>
        </div>

        <DoDeploy v-model:visible="runLoading"
                  :formData="formData" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import YamlEditor from '@/components/YamlEditor/index.vue'
import DoDeploy from './do-deploy.vue'

const formData = ref({ yaml: '', isDebug: false })
const runLoading = ref(false)
</script>
<style lang="scss" scoped>
.yaml-box {
    border: 1px solid #ccc;
}
:deep(.cm-editor) {
    width: 100%;
    height: 600px;
}

.yaml-btn {
    float: right;
    display: flex;
    margin-top: 20px;
}
</style>
