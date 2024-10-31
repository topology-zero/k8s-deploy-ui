<template>
    <div class="project-container">
        <el-row :gutter="20">
            <el-col :span="4"
                    v-for="v in project"
                    :key="v.id">
                <el-card>
                    <template #header>
                        <div class="my-card-header">
                            {{v.name}}
                        </div>
                    </template>
                    <div class="my-card-body">{{ v.desc }}</div>
                    <template #footer>
                        <el-button type="primary"
                                   @click="deploy(v)"
                                   size="small">部署</el-button>
                    </template>
                </el-card>
            </el-col>
        </el-row>

        <AddEditDialog v-model:visible="dialogVisible"
                       v-model:formData="formData" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AddEditDialog from './add-edit-dialog.vue'
import useDictStore from '@/store/dict'
import { storeToRefs } from 'pinia'
import { getProjectParams } from '@/api/common'
import { ElLoading } from 'element-plus'

const dictStore = useDictStore()
const { project } = storeToRefs(dictStore)

const dialogVisible = ref(false)
const formData = ref({})
const deploy = async (info) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        target: document.body,
        background: 'rgba(0, 0, 0, 0.7)'
    })
    formData.value = {
        projectId: info.id,
        templateId: '',
        projectName: info.name,
        projectDesc: info.desc
    }
    try {
        const { data } = await getProjectParams(info.id)
        formData.value.params = data
        dialogVisible.value = true
    } finally {
        loading.close()
    }
}
</script>
<style lang="scss" scoped>
.project-container {
    padding: 20px;
    .my-card-header {
        font-size: 14px;
        line-height: 14px;
        height: 14px;
        overflow: hidden;
    }
    .my-card-body {
        font-size: 12px;
        line-height: 12px;
        height: 24px;
        overflow: hidden;
    }
}
.el-card {
    --el-card-padding: 10px;
}
</style>
