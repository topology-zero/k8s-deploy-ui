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

const dictStore = useDictStore()
const { project } = storeToRefs(dictStore)

const dialogVisible = ref(false)
const formData = ref({})
const deploy = async (info) => {
    formData.value = {
        id: info.id,
        projectName: info.name,
        projectDesc: info.desc
    }
    dialogVisible.value = true
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
