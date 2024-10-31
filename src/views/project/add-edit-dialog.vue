<template>
    <el-dialog :title="formData.id == 0 ? '添加项目' : '编辑项目'"
               v-model="visible"
               width="50%">
        <el-form ref="elFormRef"
                 :model="formData"
                 label-width="160px">
            <el-form-item label="项目名"
                          :rules="{ required: true, trigger: 'blur', message: '请输入项目名' }"
                          prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="项目描述"
                          :rules="{ required: true, trigger: 'blur', message: '请输入项目描述' }"
                          prop="desc">
                <el-input v-model="formData.desc" />
            </el-form-item>
            <el-form-item label="GIT地址"
                          :rules="{ required: true, trigger: 'blur', message: '请输入GIT地址' }"
                          prop="git">
                <el-input v-model="formData.git" />
            </el-form-item>
            <el-form-item label="用户名"
                          :rules="{ required: true, trigger: 'blur', message: '请输入用户名' }"
                          prop="userName">
                <el-input v-model="formData.userName" />
            </el-form-item>
            <el-form-item label="密码/token"
                          :rules="{ required: formData.id == 0, trigger: 'blur', message: '请输入密码' }"
                          prop="token">
                <el-input v-model="formData.token"
                          :placeholder="formData.id == 0 ? '' : '不填写则不修改'" />
            </el-form-item>
            <el-form-item label="使用 TAG 更新版本"
                          :rules="{ required: true, trigger: 'blur', type: 'enum', enum: [0, 1], message: '请设置使用TAG更新版本' }"
                          prop="useTag">
                <el-radio-group v-model="formData.useTag">
                    <el-radio :label="0"
                              border>使用 latest</el-radio>
                    <el-radio :label="1"
                              border>使用指定 tag</el-radio>
                </el-radio-group>
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

