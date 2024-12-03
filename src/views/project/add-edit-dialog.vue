<template>
    <el-dialog :title="formData.id == 0 ? '添加项目' : '编辑项目'"
               v-model="visible"
               :close-on-click-modal="false"
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
            <el-form-item label="预设变量">
                <el-button type="success"
                           size="small"
                           @click="formData.params.push({})">新增</el-button>
                <el-table border
                          style="margin-top: 10px;"
                          size="small"
                          v-if="formData.params.length > 0"
                          :data="formData.params">
                    <el-table-column align="center"
                                     label="参数名"
                                     prop="name">
                        <template #default="{row}">
                            <el-input v-model="row.name"
                                      :disabled="row.name == 'tag'"
                                      size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label="参数值"
                                     prop="desc">
                        <template #default="{row}">
                            <el-select v-if="row.name == 'tag'"
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
            <el-form-item label="项目k8s模板">
                <el-button type="success"
                           size="small"
                           @click="formData.template.push({name: '新增模板', value:''})">
                    新增
                </el-button>
                <el-tabs type="border-card"
                         tab-position="left"
                         v-model="tabActive"
                         style="margin-top: 10px; width: 100%;"
                         closable
                         v-if="formData.template.length > 0"
                         @keydown.capture.delete.stop
                         @tab-remove="handleTabReomve">
                    <el-tab-pane v-for="(item, index) in formData.template"
                                 :key="index"
                                 :label="item.name"
                                 :name="index">
                        <template #label>
                            <el-input v-model="item.name"
                                      v-if="item.edit"
                                      style="width: 64px; padding: 0"
                                      size="small" />
                            <div v-else> {{ item.name }} </div>
                            <el-button type="primary"
                                       text
                                       :icon="item.edit ? Finished : Edit"
                                       @click="item.edit=!item.edit"
                                       size="small" />

                        </template>
                        <YamlEditor v-model="item.value" />
                    </el-tab-pane>
                </el-tabs>
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
import useDictStore from '@/store/dict'
import YamlEditor from '@/components/YamlEditor/index.vue'
import { Edit, Finished } from '@element-plus/icons-vue'

const dictStore = useDictStore()

const emit = defineEmits(['done'])
const visible = defineModel('visible', { type: Boolean })
const formData = defineModel('formData', { type: Object })

const tabActive = ref(0)
const handleTabReomve = (targetName) => {
    formData.value.template.splice(targetName, 1)
}

// 添加 or 编辑项目提交
const elFormRef = ref()
const submitForm = async () => {
    await elFormRef.value.validate()

    for (const i in formData.value.params) {
        if (formData.value.params[i].name == '' || formData.value.params[i].value == '') {
            return ElMessage.error('参数名和参数值必填')
        }
    }

    if (formData.value.id == 0) {
        await add(formData.value)
    } else {
        await edit(formData.value.id, formData.value)
    }
    visible.value = false
    emit('done')
    dictStore.getProject()
    ElMessage.success('成功')
}
</script>
<style lang="scss" scoped>
:deep(.el-tabs--left .el-tabs__header.is-left) {
    margin-right: 0;
}
:deep(.el-tabs__content) {
    padding: 0;
}
:deep(.el-input__inner:not(.el-select .el-input__inner)) {
    padding: 0;
}
</style>
