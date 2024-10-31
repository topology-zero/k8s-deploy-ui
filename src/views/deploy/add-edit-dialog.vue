<template>
    <el-dialog title="上线项目"
               v-model="visible"
               width="50%">
        <el-form ref="elFormRef"
                 :model="formData"
                 label-width="160px">
            <el-form-item label="上线名"
                          :rules="{ required: true, trigger: 'blur', message: '请输入上线名' }"
                          prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="项目名">
                <el-input v-model="formData.projectName"
                          disabled />
            </el-form-item>
            <el-form-item label="项目描述">
                <el-input v-model="formData.projectDesc"
                          disabled />
            </el-form-item>
            <el-form-item label="使用模板"
                          :rules="{ required: true, trigger: 'blur', message: '请输入使用模板' }"
                          prop="templateId">
                <el-select v-model="formData.templateId"
                           style="width:100%">
                    <el-option v-for="val, key in template"
                               :key="key"
                               :label="val.name"
                               :value="val.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="模板变量">
                <el-button type="success"
                           size="small"
                           @click="formData.params.push({})">新增</el-button>
                <el-table border
                          style="margin-top: 10px;"
                          size="small"
                          :data="formData.params">
                    <el-table-column align="center"
                                     label="参数名"
                                     prop="name">
                        <template #default="{row}">
                            <el-input v-model="row.name"
                                      :disabled="row.name == 'tag' || row.name == 'namespace' "
                                      size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label="参数值"
                                     prop="desc">
                        <template #default="{row}">
                            <el-select v-if="row.name == 'tag' || row.name == 'namespace' "
                                       size="small"
                                       v-model="row.value"
                                       style="width:100%">
                                <el-option v-for="val, key in row.options"
                                           :key="key"
                                           :label="val"
                                           :value="val" />
                            </el-select>
                            <el-input v-else
                                      v-model="row.value"
                                      size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     width="170px"
                                     label="操作">
                        <template #default="{$index}">
                            <el-button size="small"
                                       type="danger"
                                       @click="formData.params.splice($index, 1)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
import useDictStore from '@/store/dict'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const dictStore = useDictStore()
const { template } = storeToRefs(dictStore)

const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

// 添加项目提交
const elFormRef = ref()
const submitForm = async () => {
    await elFormRef.value.validate()

    for (const i in formData.value.params) {
        if (formData.value.params[i].name == '' || formData.value.params[i].value == '') {
            return ElMessage.error('参数名和参数值必填')
        }
    }

    await add(formData.value)
    visible.value = false
    ElMessage.success('成功')
    router.push('/deploy/index')
}
</script>

