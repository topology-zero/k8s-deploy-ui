<template>
    <el-dialog title="添加命名空间"
               v-model="visible"
               :close-on-click-modal="false"
               width="30%">
        <el-form ref="elFormRef"
                 :model="formData"
                 label-width="100px">
            <el-form-item label="命名空间"
                          :rules="{ required: true, trigger: 'blur', message: '请输入命名空间' }"
                          prop="name">
                <el-input v-model="formData.name" />
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
import { add } from './api'

const emit = defineEmits(['done'])
const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

// 添加 or 编辑用户提交
const elFormRef = ref()
const submitForm = async () => {
    await elFormRef.value.validate()
    await add(formData.value)
    visible.value = false
    emit('done')
    ElMessage.success('成功')
}
</script>

