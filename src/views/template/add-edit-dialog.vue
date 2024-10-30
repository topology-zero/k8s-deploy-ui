<template>
    <el-dialog :title="formData.id == 0 ? '添加模板' : '编辑模板'"
               v-model="visible"
               width="50%">
        <el-form ref="elFormRef"
                 :model="formData"
                 label-width="160px">
            <el-form-item label="模板名"
                          :rules="{ required: true, trigger: 'blur', message: '请输入模板名' }"
                          prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="模板名描述"
                          prop="desc">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="模板编辑"
                          :rules="{ required: true, trigger: 'blur', message: '请输入模板编辑' }"
                          prop="content">
                <YamlEditor v-model="formData.content" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary"
                       @click="submitForm()">确 定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import YamlEditor from '@/components/YamlEditor/index.vue'
import { add, edit } from './api'

const emit = defineEmits(['done'])
const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

// 添加 or 编辑项目提交
const elFormRef = ref()
const submitForm = async () => {
    await elFormRef.value.validate()
    if (formData.value.id == 0) {
        await add(formData.value)
    } else {
        await edit(formData.value.id, formData.value)
    }
    visible.value = false
    emit('done')
    ElMessage.success('成功')
}
</script>

