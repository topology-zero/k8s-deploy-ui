<template>
    <div class="app-container">
        <p class="page-title">命名空间列表</p>
        <div class="filter-container">
            <el-button v-permission="`namespace:add`"
                       type="primary"
                       size="default"
                       plain
                       @click="handleAdd()">
                添加命名空间
            </el-button>
        </div>
        <el-table v-loading="tableLoading"
                  element-loading-text="加载中..."
                  border
                  :data="list">
            <el-table-column align="center"
                             label="命名空间"
                             prop="name" />
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template #default="{row}">
                    <el-button v-permission="`namespace:del`"
                               size="small"
                               type="danger"
                               @click="handleDel(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-edit-dialog v-model:visible="dialogVisible"
                         v-model:formData="formData"
                         @done="_getData" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getList, del } from './api'
import { usePage } from '@/utils/mixin/page'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddEditDialog from './add-edit-dialog.vue'

const defaultFormData = () => ({
    name: ''
})

// data
const dialogVisible = ref(false)
const formData = ref(defaultFormData())

// mixin
// 获取数据
const _getData = async () => {
    tableLoading.value = true
    const { data } = await getList(params.value)
    list.value = data
    tableLoading.value = false
}
const {
    tableLoading,
    list,
    params
} = usePage(_getData)

// 添加命名空间
const handleAdd = () => {
    dialogVisible.value = true
    formData.value = defaultFormData()
}

// 删除命名空间
const handleDel = async ({ name }) => {
    await ElMessageBox.confirm('删除命名空间不可恢复', '警告')
    const { message } = await del({ name })
    ElMessage.success(message)
    _getData(params)
}
</script>
